const express = require('express')

const router = express.Router();
const{ createPost,GetProfileContentByUserId,updatePost,getAllPosts,deletePost,likePost,unlikePost,getPostById, getPostsCommentsReplies } = require('../controllers/postController')
const{ getCommentsByPost,postComment,postReply,getAllRepliesByCommentId} = require('../controllers/postController')


const { sessionAuth } = require('../middlewares/sessionAuth')


router.use(sessionAuth)

router.get('/posts',getAllPosts)
router.get('/postUser',GetProfileContentByUserId)

router.get('/pCR',getPostsCommentsReplies)

router.get('/posts/:post_id',getPostById)
router.post('/posts',createPost)
router.post('/posts/delete',deletePost)
router.post('/post/like',likePost)
router.post('/post/unlike',unlikePost)
router.post('/posts/:post_id',updatePost)

router.get('/posts/:id/comments',getCommentsByPost)
router.post('/posts/:post_id/comments',postComment)
router.post('/posts/:post_id/comments/:comment_id',postReply)
router.get('/posts/:post_id/comments/:comment_id/replies',getAllRepliesByCommentId)


module.exports = router;

