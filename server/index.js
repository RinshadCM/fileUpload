const express = require('express');
const cors=require('cors')
const multer = require('multer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const db= require("./db")

const bodyParser = require('body-parser')

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json())


app.use(cors({origin:'http://localhost:3000'}))

const users = []; // a placeholder for user data

// Route for user registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save the user data to MongoDB
    const user = new db.User({ username, password: hashedPassword });
    await user.save();
    res.sendStatus(200);
});


// Route for user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Find the user data in the array by username
    const user = users.find(user => user.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
    console.log("Successsssssssssssssssssss");
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
