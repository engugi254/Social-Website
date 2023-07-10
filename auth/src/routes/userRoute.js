const userRoute = require('express').Router()
const { postUser, loginUser,deleteUser,addProfile,showFollowers } = require('../controllers/userController')


userRoute.post('/register', postUser)
userRoute.post('/login', loginUser)
userRoute.post('/deleteAccount', deleteUser)
userRoute.post('/profile', addProfile)
userRoute.get('/followers/:id', showFollowers)

module.exports = userRoute;