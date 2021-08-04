const express = require('express')

const router = express.Router()
const {
  signup,
  signin,
  resetPassword,
  newPassword,
  protected
} = require('../controllers/auth.controller')

// middleware
const authenticate = require('../middleware/authenticate')

router.post('/signup', signup)

router.post('/signin', signin)
router.post('/reset-password', resetPassword)
router.post('/new-password', newPassword)

router.get('/protected',authenticate, protected)

module.exports = router
