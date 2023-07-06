const userRoute = require('express').Router()
const { postUser, loginUser } = require('../controllers/userController')


userRoute.post('/', postUser)
userRoute.post('/login', loginUser)

module.exports = userRoute;