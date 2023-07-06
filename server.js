const express = require("express");
require('dotenv').config();


const router = require('./routes/postRoute')
const userRoute = require('./routes/userRoute')

const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Ok");
})

app.use(router)
app.use('/users',userRoute)

const port = process.env.PORT || 4000;

app.listen(port,()=>console.log(`Server on port: ${port}`))