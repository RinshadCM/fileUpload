const mongoose = require('mongoose');
const { Schema, model } = mongoose;

mongoose.connect('mongodb://localhost:27017/file-upload-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new Schema({
  username: String,
  password: String,
  files: [{
    name: String,
    data: Buffer,
    contentType: String
  }]
});

const fileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  code: String,
  file: {
    name: String,
    data: Buffer,
    contentType: String
  }
});

const User = model('User', userSchema);
const File = model('File', fileSchema);

async function saveFile(userId, code, file) {
  const savedFile = new File({
    userId: userId,
    code: code,
    file: file
  });
  if (userId) {
    await savedFile.save();
  } else {
    throw new Error('User not authenticated');
  }
  return savedFile;
}


module.exports = { User, File, saveFile };
