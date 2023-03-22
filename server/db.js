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
    contentType: String,
    code: String
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
    contentType: String,
    code: String
  }
});

const User = model('User', userSchema);
const File = model('File', fileSchema);


async function saveFile(userId, code, file) {
  const originalFileName = file;
  const savedFile = new File({
    userId: userId,
    code: code,
    file: {
      name: originalFileName,
      data: file.buffer,
      contentType: file.mimetype
    }
  });
  await savedFile.save();

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.files.push({
    fileId: originalFileName,
    name: savedFile._id,
    contentType: file.mimetype,
    code: savedFile.code
  });
  await user.save();

  return savedFile;
}

module.exports = { User, File, saveFile };
