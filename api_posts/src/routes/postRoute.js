const express = require('express')

const router = express.Router();
const{ getAllPosts } = require('../controllers/postController')


router.get('/posts',getAllPosts)

module.exports = router;

