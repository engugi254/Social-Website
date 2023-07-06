const express = require("express");
require('dotenv').config();


const router = require('./src/routes/postRoute')


const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Ok");
})

app.use(router)

const port = process.env.PORT || 5000;

app.listen(port,()=>console.log(`Server on port: ${port}`))