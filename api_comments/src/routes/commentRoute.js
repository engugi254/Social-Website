const express = require('express')

const router = express.Router();
const{  getFollowerCount, getFollowingCount, insertLike, getAllNotifications,getUnReadNotifications, markAsRead, getUserById} = require('../controllers/commentController')
const { sessionAuth } = require('../middlewares/sessionAuth')

router.use(sessionAuth)


router.get('/:id/notifications',getAllNotifications)
router.get('/:user_id',getUserById)


router.get('/:id/notifications/unread',getUnReadNotifications)
router.post('/:notificationId/notifications/read',markAsRead)


router.post('/posts/:user_id/:post_id',insertLike)

router.get('/:id/followers',getFollowerCount)
router.get('/:id/following',getFollowingCount)


module.exports = router;

