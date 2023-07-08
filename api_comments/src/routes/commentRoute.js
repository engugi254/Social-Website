const express = require('express')

const router = express.Router();
const{ getCommentsByPost, postComment} = require('../controllers/commentController')
const { sessionAuth } = require('../middlewares/sessionAuth')

router.use(sessionAuth)

router.get('/posts/:id/comments',getCommentsByPost)
router.post('/posts/:id/comments',postComment)


module.exports = router;

