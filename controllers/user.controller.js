const Post = require('../models/Post')
const User = require('../models/User')
exports.userId = async (req, res) => {
  User.findOne({ _id: req.params.id })
    .select('-password') //! no include
    .then(user => {
      Post.find({ postedBy: req.params.id })
        .populate('postedBy', '_id name')
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err })
          }
          res.json({ user, posts })
        })
    })
    .catch(err => {
      return res.status(404).json({ error: 'User not found' })
    })
}
exports.follow = async (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id }
    },
    {
      new: true
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err })
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId }
        },
        { new: true }
      )
        .select('-password')
        .then(result => {
          res.json(result)
        })
        .catch(err => {
          return res.status(422).json({ error: err })
        })
    }
  )
}
exports.unfollow = async (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id }
    },
    {
      new: true
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err })
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId }
        },
        { new: true }
      )
        .select('-password')
        .then(result => {
          res.json(result)
        })
        .catch(err => {
          return res.status(422).json({ error: err })
        })
    }
  )
}
exports.updatepic = async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: 'pic canot post' })
      }
      res.json(result)
    }
  )
}
exports.searchUsers = async (req, res) => {
  // console.log('hit search user')
  let userPattern = new RegExp('^' + req.body.query)
  // console.log(req.body.query)
  User.find({ email: { $regex: userPattern } })
    .select('_id email')
    .then(user => {
      res.json({ user })
    })
    .catch(err => {
      console.log(err)
    })
}
