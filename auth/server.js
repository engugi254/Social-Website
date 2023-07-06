const express = require("express");
require('dotenv').config();


const userRoute = require('./src/routes/userRoute')

const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Ok");
})


app.use('/users',userRoute)

const port = process.env.PORT || 4000;

app.listen(port,()=>console.log(`Server on port: ${port}`))