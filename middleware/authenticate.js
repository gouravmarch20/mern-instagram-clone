// npm
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.SECRET_KEY //! update
const mongoose = require('mongoose')
const User = require('../models/User')

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers
  //authorization === Bearer ewefwegwrherhe
  if (!authorization) {
    return res.status(401).json({ error: 'you must be logged in' })
  }
  const token = authorization.replace('Bearer ', '')
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'you must be logged in' })
    }

    const { _id } = payload
    User.findById(_id).then(userdata => {
      req.user = userdata//! complete data of login user access

      
  
      next()
    })
  })
}

module.exports = authenticate
