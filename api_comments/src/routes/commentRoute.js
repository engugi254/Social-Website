const express = require('express')

const router = express.Router();
const{  getAllUsers,apiFollow,getFollowerCount, getFollowingCount, getAllNotifications,getUnReadNotifications, markAsRead, getUserById} = require('../controllers/commentController')
const { sessionAuth } = require('../middlewares/sessionAuth')

router.use(sessionAuth)


router.get('/:id/notifications',getAllNotifications)
router.get('/:user_id',getUserById)


router.get('/:id/notifications/unread',getUnReadNotifications)
router.post('/:notificationId/notifications/read',markAsRead)



router.get('/:userID/followers',getFollowerCount)
router.get('/:userID/following',getFollowingCount)

router.get('/api/users',getAllUsers)
router.post('/api/follow',apiFollow)




module.exports = router;

