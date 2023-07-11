const express = require('express')

const router = express.Router();
const{ getCommentsByPost, postComment,getAllNotifications,getUnReadNotifications,getAllRepliesByCommentId,postReply} = require('../controllers/commentController')
const { sessionAuth } = require('../middlewares/sessionAuth')

router.use(sessionAuth)

router.get('/posts/:id/comments',getCommentsByPost)
router.post('/posts/:id/comments',postComment)
router.post('/posts/:id/comments/:comment_id',postReply)
router.get('/posts/:id/comments/:comment_id/replies',getAllRepliesByCommentId)
router.get('/:id/notifications',getAllNotifications)
router.get('/:id/notifications/unread',getUnReadNotifications)


module.exports = router;

