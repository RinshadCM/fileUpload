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
        sub: user._id,
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
        if (!user) {
            return res.sendStatus(401);
        }
        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.sendStatus(401);
        }
        // Generate a token for the user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        process.exit(1);
    }
});



// Route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
    const { filename } = req.file;
    const code = Math.floor(100000 + Math.random() * 900000); // generate a 6-digit code
    // Rename the file to the code
    fs.renameSync(
        path.join(__dirname, 'uploads', filename),
        path.join(__dirname, 'uploads', `${code}.dat`)
    );
    res.json({ code });
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
app.delete('/file/:code', (req, res) => {
    const { code } = req.params;
    // Check if the file exists
    if (fs.existsSync(path.join(__dirname, 'uploads', `${code}.dat`))) {
        // Delete the file from the file system
        fs.unlinkSync(path.join(__dirname, 'uploads', `${code}.dat`));
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

app.listen(3001, () => {
    console.log('Server started on port 3000');
});
