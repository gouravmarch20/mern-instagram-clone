const express = require('express')
const router = express.Router()
const {
  userId,
  follow,
  unfollow,
  updatepic,
  searchUsers
} = require('../controllers/User.controller')
// middleware
const authenticate = require('../middleware/authenticate')

router.get('/user/:id', authenticate, userId)

router.put('/follow', authenticate, follow)
router.put('/unfollow', authenticate, unfollow)
router.put('/updatepic', authenticate, updatepic)
router.post('/search-users', authenticate, searchUsers)

module.exports = router
