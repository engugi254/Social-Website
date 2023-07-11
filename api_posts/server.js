const express = require("express");
require("dotenv").config();
const mssql = require("mssql");
const config = require("./src/config/config");
const postRoute = require("./src/routes/postRoute")


const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors());


const pool  = new mssql.ConnectionPool(config)

async function startApp() {
  try {
    await pool.connect();
    console.log("App connected to database");
    
    app.use((req, res, next) => {
      req.pool = pool;
      next();
    });
    
    app.use(postRoute);
    
    app.get("/", (req, res) => {
      res.send("Ok");
    });
    
    app.get("*", (req, res) => {
      res.status(404).json({ message: "Page not found" });
    });
    
    const port = process.env.PORT;
    
    app.listen(port, () => {
      console.log(`Posts Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startApp();