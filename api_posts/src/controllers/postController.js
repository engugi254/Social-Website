const mssql = require('mssql')
const config = require('../config/config')

async function createPost(req, res) {
    try {
        let { user_id, content } = req.body;
        const pool = req.pool;

        if (pool.connected) {
            let results = await pool.request()
                .input("user_id", user_id)
                .input("content", content)
                .execute('dbo.CreatePost');

            console.log(results);

            res.json({
                success: true,
                message: "Post created successfully",
                data: results.recordsets[0]
            });
        } else {
            throw new Error("Internal server error");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create post",
            error: error.message
        });
    }
}


async function deletePost(req, res) {
    try {
        const { post_id } = req.body;
        const pool = req.pool;

        if (pool.connected) {
            const result = await pool.request()
                .input("post_id", post_id)
                .execute("dbo.SoftDeletePost");

            // Check if any rows were affected by the deletion
            if (result.rowsAffected[0] > 0) {
                res.json({
                    success: true,
                    message: "Post deleted successfully",
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Error deleting post",
                });
            }
        } else {
            throw new Error("Internal Error");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete post",
            error: error.message,
        });
    }
}

async function getAllPosts(req,res){
    const pool = req.pool
    if(pool.connected){
        let results = await pool.query(`SELECT * from dbo.Post`);
        let posts = results.recordset;
        res.json({
            success:true,
            message:"fetched posts successfully",
            results:posts
        })
    }else{
        res.status(500).send("Internal server error")
    }
}
async function likePost(req, res) {
    try {
        let { user_id, post_id } = req.body;
        const pool = req.pool;

        if (pool.connected) {
            let results = await pool.request()
                .input("post_id", post_id)
                .input("user_id", user_id)
                .execute('dbo.InsertPostLike');

                if (results.rowsAffected[0] > 0) {
                    res.json({
                        success: true,
                        message: "Post liked successfully",
                    });
            } else if (results.rowsAffected[0] < 0) {
                res.json({
                    success: false,
                    message: "You have already liked this post",
                });
            } else {
                throw new Error("Unexpected result from stored procedure");
            }
        } else {
            throw new Error("Internal server error");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to like post",
            error: error.message
        });
    }
}

async function unlikePost(req, res) {
    try {
        let { user_id, post_id } = req.body;
        const pool = req.pool;

        if (pool.connected) {
            let results = await pool.request()
                .input("user_id", user_id)
                .input("post_id", post_id)
                .execute('dbo.unlikePost');

            if (results.rowsAffected[0] > 0) {
                res.json({
                    success: true,
                    message: "Post unliked successfully",
                });
            } else {
                res.json({
                    success: false,
                    message: "You have already unliked this post",
                });
            }
        } else {
            throw new Error("Internal server error");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to unlike post",
            error: error.message
        });
    }
}
async function getPostById(req,res){
    let {id} = req.params;

    let pool = req.pool;
    if(pool.connected){
        let results = await pool.query(`SELECT * from Post WHERE post_id=${id}`);
        let posts = results.recordset;
        res.json({
            success:true,
            message:"Accessing post successfully",
            results:posts
        })
    }else{
        res.status(500).send("Internal server error")
    }
}
module.exports = {getAllPosts,createPost,deletePost,likePost,unlikePost,getPostById}