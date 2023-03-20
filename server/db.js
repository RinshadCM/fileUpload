const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/file-upload-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  files: [{
    code: String,
    name: String,
    path: String,
  }],
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
