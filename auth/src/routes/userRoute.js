const userRoute = require('express').Router()
const { postUser,showUsers,showUserById,updateProfilePic, loginUser,deleteUser,addProfile,getProfile,updateProfile,showFollowers } = require('../controllers/userController')
const authorize  = require("../middlewares/session");


userRoute.post("/register",postUser)


userRoute.post('/login', loginUser)

userRoute.use(authorize)

userRoute.post('/deleteAccount', deleteUser)

userRoute.post('/profile', addProfile)
userRoute.post('/update_profile', updateProfile)
userRoute.post('/update_profile_pic', updateProfilePic)

userRoute.get('/followers/:id', showFollowers)
userRoute.get('/', showUsers)


userRoute.get('/:username', showUserById)

userRoute.get('/profile/:user_id', getProfile)

module.exports = userRoute;