const express = require('express')

const router = express.Router();
const{ getAllPosts } = require('../controllers/postController')
const { sessionAuth } = require('../middlewares/sessionAuth')

router.use(sessionAuth)

router.get('/posts',getAllPosts)

module.exports = router;

