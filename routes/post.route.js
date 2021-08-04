const express = require('express')
const router = express.Router()
const {
  allPost,
  getsubPost,
  createPost,
  myPost,
  like,
  unlike,
  comment,
  deletePost
} = require('../controllers/post.controller')
// middleware
const authenticate = require('../middleware/authenticate')

router.get('/allpost', allPost)

router.get('/getsubpost', authenticate, getsubPost)
router.post('/create-post', authenticate, createPost)
router.get('/mypost', authenticate, myPost)

router.put('/like', authenticate, like)
router.put('/unlike', authenticate, unlike)
router.put('/comment', authenticate, comment)

router.delete('/deletepost/:postId', authenticate, deletePost)

module.exports = router
