const express = require("express");
require('dotenv').config();
const { v4 } = require("uuid")
const session = require('express-session');
const authorize = require('./src/middlewares/session');

const userRoute = require('./src/routes/userRoute')

const app = express();
app.use(express.json());

app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    genid: ()=>v4(),
    resave: true,
    rolling: true,
    cookie:{
        httpOnly: true,
        secure: false
    }
}))

app.get('/',(req,res)=>{
    res.send("Ok");
})

// Example route that requires authentication
app.get('/protected', authorize, (req, res) => {
    // Authorized route handler logic
    res.send('You have access to the protected route!');
  });

app.use('/users', userRoute)

const port = process.env.PORT || 4000;

app.listen(port,()=>console.log(`Server on port: ${port}`))