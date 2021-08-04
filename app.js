const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
// npm
const mongoose = require('mongoose')
const express = require('express')
const app = express()
// coustom module
require('./db/connection')
// varible
const PORT = process.env.PORT || 5000
// ---Middleware
app.use(express.json())

// --- Import route

const authRoutes = require('./routes/auth.route')
const postRoutes = require('./routes/post.route')
const userRoutes = require('./routes/user.route')
//  ---My route
app.use('/', authRoutes)
app.use('/', postRoutes)
app.use('/', userRoutes)

if (process.env.NODE_ENV == 'production') {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
