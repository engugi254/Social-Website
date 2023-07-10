const express = require('express')

const router = express.Router();
const{ getCommentsByPost, postComment,getNotifications} = require('../controllers/commentController')
const { sessionAuth } = require('../middlewares/sessionAuth')

router.use(sessionAuth)

router.get('/posts/:id/comments',getCommentsByPost)
router.post('/posts/:id/comments',postComment)
router.get('/:id/notifications',getNotifications)

module.exports = router;

