const express = require('express')

const router = express.Router();
const{ createPost,getAllPosts,deletePost,likePost,unlikePost,getPostById } = require('../controllers/postController')
const{  } = require('../controllers/postController')

const { sessionAuth } = require('../middlewares/sessionAuth')

router.use(sessionAuth)

router.get('/posts',getAllPosts)
router.get('/posts/:id',getPostById)
router.post('/posts',createPost)
router.post('/posts/delete',deletePost)
router.post('/post/like',likePost)
router.post('/post/unlike',unlikePost)

module.exports = router;

