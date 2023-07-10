const mssql = require('mssql')
const config = require('../config/config')


async function getCommentsByPost(req,res){
    const{id} = req.params;

    let sql = await mssql.connect(config);
    if(sql.connected){
        let results = await sql.query(`SELECT * from dbo.Comment WHERE post_id = ${id}`);
        let posts = results.recordset;
        res.json({
            success:true,
            message:"fetched comments successfully",
            results:posts
        })
    }else{
        res.status(500).send("Internal server error")
    }
}


async function postComment(req, res) {
    const { id } = req.params;
    const { user_id, content } = req.body;

  let sql = await mssql.connect(config);
  if(sql.connected){
    let results = await sql.request()
                        .input("post_id",id)
                        .input("user_id",user_id)
                        .input("content",content)
                        .execute("dbo.InsertComment")
       
         console.log(results)
        results.rowsAffected.length ? res.send({ success: true, message: 'Saved Comment' }) :
            res.send({ success: false, message: 'An error occurred' })


}
}
async function getNotifications(req,res){
    const{id} = req.params;

    let sql = await mssql.connect(config);
    if(sql.connected){
        let results = await sql.query(`SELECT * from dbo.Notification WHERE user_id = ${id}`);
        let posts = results.recordset;
        res.json({
            success:true,
            message:"fetched Notifications successfully",
            results:posts
        })
    }else{
        res.status(500).send("Internal server error")
    }
}




module.exports = {getCommentsByPost,postComment,getNotifications}