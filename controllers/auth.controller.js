const crypto = require('crypto')
//  import
const { JWT_SECRET } = require('../config/keys')
const User = require('../models/User')
// npm
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const nodemailer = require('nodemailer')
// const sendgridTransport = require('nodemailer-sendgrid-transport')

// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key:
//         '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'
//     }
//   })
// )
// logic
exports.signup = async (req, res) => {
  // console.log('hit signup')

  const { name, email, password, pic } = req.body
  if (!email || !password || !name) {
    return res.status(422).json({ error: 'please add all the fields' })
  }
  User.findOne({ email: email })
    .then(savedUser => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: 'user already exists with that email' })
      }
      bcrypt.hash(password, 12).then(hashedpassword => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          pic
        })

        user
          .save()
          .then(user => {
            //   transporter.sendMail({
            //     to: user.email,
            //     from: 'orangerigion@gmail.com',
            //     subject: 'signup done success',
            //     html: '<h1>welcome to mini instagram</h1>'
            //   })
            res.json({ message: 'saved successfully' })
          })
          .catch(err => {
            console.log(err)
          })
      })
    })
    .catch(err => {
      console.log(err)
    })
}
exports.signin = async (req, res) => {
  // console.log('hit signin ')
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(422).json({ error: 'please add email or password' })
  }
  User.findOne({ email: email }).then(savedUser => {
    if (!savedUser) {
      return res.status(422).json({ error: 'Invalid Email or password' })
    }
    bcrypt
      .compare(password, savedUser.password)
      .then(doMatch => {
        if (doMatch) {
          // res.json({message:"successfully signed in"})
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
          const { _id, name, email, followers, following, pic } = savedUser
          res.json({
            token,
            user: { _id, name, email, followers, following, pic }
          })
        } else {
          return res.status(422).json({ error: 'Invalid Email or password' })
        }
      })
      .catch(err => {
        console.log(err)
      })
  })
}
exports.resetPassword = async (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
    }
    const token = buffer.toString('hex')
    User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        return res
          .status(422)
          .json({ error: 'User dont exists with that email' })
      }
      user.resetToken = token
      user.expireToken = Date.now() + 3600000
      user.save().then(result => {
        transporter.sendMail({
          to: user.email,
          from: 'no-replay@insta.com',
          subject: 'password reset',
          html: `
                <p>You requested for password reset</p>
                <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                `
        })
        res.json({ message: 'check your email' })
      })
    })
  })
}
exports.newPassword = async (req, res) => {
  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        return res.status(422).json({ error: 'Try again session expired' })
      }
      bcrypt.hash(newPassword, 12).then(hashedpassword => {
        user.password = hashedpassword
        user.resetToken = undefined
        user.expireToken = undefined
        user.save().then(saveduser => {
          res.json({ message: 'password updated success' })
        })
      })
    })
    .catch(err => {
      console.log(err)
    })
}
// ! TEST MIDDLEWARE
exports.protected = async (req, res) => {
  res.json({ message: 'done' })
  console.log(req.user)
}
