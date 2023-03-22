const express = require('express');
const cors = require('cors')
const multer = require('multer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const db = require("./db")
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }))

const users = []; // a placeholder for user data

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await db.User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Invalid credentials' });
        }
    } catch (err) {
        return done(err);
    }
}));

function generateToken(user) {
    const payload = {
        id: user._id,
        iat: Date.now(),
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
}



app.use(passport.initialize());

// app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
//     const token = generateToken(req.user);
//     res.json({ token });
// });


// Route for user registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await db.User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user data to MongoDB
    const user = new db.User({ username, password: hashedPassword });
    await user.save();

    res.sendStatus(200);
});



// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user data in the MongoDB database by username
        const user = await db.User.findOne({ username });
        console.log(user);
        if (!user) {
            return res.sendStatus(401);
        }
        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.sendStatus(401);
        }
        // Generate a token for the user
        const token = generateToken(user);
        const userId = user._id
        res.json({ token, userId });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        process.exit(1);
    }
});



// Middleware function to verify token
function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        req.user = { _id: decoded.id }; // set the user object in the request
        next();
    });
}





// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function(req, file, callback) {
    // Generate a new filename by appending the current timestamp to the original filename
    const newFilename = Date.now() + '-' + file.originalname;
    callback(null, newFilename);
  }
});

// Initialize upload variable
const uploaded = multer({
  storage: storage
});

// Route for file upload
app.post('/upload', verifyToken, uploaded.single('file'), async (req, res) => {
  const { originalname, mimetype, buffer } = req.file;
  const code = Math.floor(100000 + Math.random() * 900000); // generate a 6-digit code

  try {
    if (!req.user) { // check if user is authenticated
      throw new Error('User not authenticated');
    }
    const savedFile = await db.saveFile(req.user._id, code, originalname, {
      name: originalname,
      data: buffer,
      contentType: mimetype
    });

    // Rename the uploaded file
    const oldPath = path.join(__dirname, 'uploads', req.file.filename);
    const newFilename = savedFile._id + '-' + req.file.originalname;
    const newPath = path.join(__dirname, 'uploads', newFilename);
    fs.renameSync(oldPath, newPath);

    res.json({ code, fileId: savedFile._id });
  } catch (err) {
    console.error(`Error uploading file: ${err}`);
    res.status(500).send('Error uploading file');
  }
});






app.get('/files/:userId', async (req, res) => {
    const { userId } = req.params;
    const user = await db.User.findById(userId).populate('files');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const files = user.files.map(file => {
        return {
            filename: file._id,
            code: file.code,
            name: file.name
        };
    });
    res.json(files);
});






// Route for file retrieval
app.get('/download/:code', (req, res) => {
    const { code } = req.params;
    // Check if the file exists
    if (fs.existsSync(path.join(__dirname, 'uploads', `${code}.dat`))) {
        // Stream the file to the response
        res.sendFile(path.join(__dirname, 'uploads', `${code}.dat`));
    } else {
        res.sendStatus(404);
    }
});

// Route for file deletion
app.delete('/files/:userId/:code', async (req, res) => {
    const { userId } = req.params;
    const { code } = req.params;
    console.log(userId, code);
    try {
        console.log(`Deleting file with code ${code}...`);

        // delete file from the database
        const deletedFile = await db.File.findOneAndDelete({ code });
        console.log(deletedFile);
        if (!deletedFile) {
            console.log(`File with code ${code} not found`);
            return res.status(404).send({ message: 'File not found' });
        }
        console.log(`File ${deletedFile.file.name} deleted from database`);

        // delete file from the file system
        const filePath = path.join(__dirname, 'uploads', deletedFile._id + '-' + deletedFile.file.name);
        await new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file from file system: ${err}`);
                    reject(err);
                } else {
                    console.log(`File ${deletedFile.file.name} deleted from file system`);
                    resolve();
                }
            });
        });

        // update user's files array in the database
        const updatedUser = await db.User.findByIdAndUpdate(
            deletedFile.userId,
            { $pull: { files: { fileId: deletedFile._id } } },
            { new: true }
        );        
        if (!updatedUser) {
            console.log(`User with file ${deletedFile._id} not found`);
            return res.status(404).send({ message: 'User not found' });
        }
        console.log(`User ${updatedUser.username} updated successfully`);

        res.send({ message: 'File deleted successfully' });
    } catch (err) {
        console.error(`Error deleting file: ${err}`);
        res.status(500).send({ message: 'Internal server error' });
    }
});




app.listen(3001, () => {
    console.log('Server started on port 3001');
});
