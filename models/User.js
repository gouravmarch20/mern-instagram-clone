// --- npm inculuding
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

//---  Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  expireToken: Date,
  pic: {
    type: String,
    default:
      'https://res.cloudinary.com/parthgourav/image/upload/v1627187831/no-image-availabe_ex2nfd.png'
  },
  followers: [{ type: ObjectId, ref: 'User' }],
  following: [{ type: ObjectId, ref: 'User' }]
})

const User = mongoose.model('User', UserSchema)

module.exports = User
