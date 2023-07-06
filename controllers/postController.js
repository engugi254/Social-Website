const mssql = require('mssql')
const config = require('../config/config')


async function getAllPosts(req,res){
    let sql = await mssql.connect(config);
    if(sql.connected){
        let results = await sql.query(`SELECT * from dbo.Users`);
        let posts = results.recordset;
        res.json({
            success:true,
            message:"fetched products successfully",
            results:posts
        })
    }else{
        res.status(500).send("Internal server error")
    }
}

module.exports = {getAllPosts}