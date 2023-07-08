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
    const { user_id, comment } = req.body;

  let sql = await mssql.connect(config);
  if(sql.connected){
    let results = await sql.request()
                        .input("post_id",id)
                        .input("user_id",user_id)
                        .input("content",comment)
                        .execute("dbo.InsertComment")
       
         console.log(results)
        results.rowsAffected.length ? res.send({ success: true, message: 'Saved User' }) :
            res.send({ success: false, message: 'An error occurred' })


}
}



module.exports = {getCommentsByPost,postComment}