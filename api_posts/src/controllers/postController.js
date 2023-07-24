const mssql = require('mssql')
const config = require('../config/config')

async function createPost(req, res) {
    try {
        let { user_id, content, image } = req.body;
        const pool = req.pool;

        if (pool.connected) {
            let results = await pool.request()
                .input("user_id", user_id)
                .input("content", content)
                .input("image", image)
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


async function updatePost(req, res) {
    try {
        const { content, image } = req.body;
        const { post_id } = req.params;
        const pool = req.pool;

        if (pool.connected) {
            const result = await pool.request()
                .input("post_id", post_id)
                .input("content", content)
                .input("image", image)
                .execute("dbo.updatePost");

            // Check if any rows were affected by the deletion
            if (result.rowsAffected[0] > 0) {
                res.json({
                    success: true,
                    message: "Post updated successfully",
                    userId: req.session.userId
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Error updating post",
                });
            }
        } else {
            throw new Error("Internal Error");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update post",
            error: error.message,
        });
    }
}
async function getAllPosts(req,res){
    const pool = req.pool
    if(pool.connected){
        let results = await pool.query(`SELECT
        p.post_id,
        p.user_id,
        p.content,
        p.image,
        p.timestamp,
        COUNT(pl.user_id) AS total_likes
    FROM
        Post AS p
    LEFT JOIN
        PostLike AS pl ON p.post_id = pl.post_id
        WHERE pl.isDeleted = 0

    GROUP BY
        p.post_id,
        p.user_id,
        p.content,
        p.image,
        p.timestamp
    ORDER BY
        p.timestamp DESC;
    `);
        let posts = results.recordset;
        res.json({
            success:true,
            message:"fetched posts successfully",
            results:posts,
            userId:req.session.userId
        })
    }else{
        res.status(500).send("Internal server error")
    }
}
async function GetProfileContentByUserId(req,res){
    const pool = req.pool
    if(pool.connected){
        let results = await pool.request()
        .execute('GetProfileContentByUserId')
        let posts = results.recordset;
        res.json({
            success:true,
            message:"fetched posts successfully",
            results:posts,
            userId:req.session.userId
        })
    }else{
        res.status(500).send("Internal server error")
    }
}


async function getCommentsByPost(req,res){
    const{id} = req.params;

    let pool = req.pool;
    if(pool.connected){
        let results = await pool.query(`SELECT * from dbo.Comment WHERE post_id = ${id}`);
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

async function getAllRepliesByCommentId(req,res){
    const{post_id,comment_id} = req.params;

    let pool = req.pool;
    if(pool.connected){
        let results = await pool.query(`SELECT * from dbo.Reply WHERE post_id = ${id} AND comment_id=${comment_id}`);
        let posts = results.recordset;
        res.json({
            success:true,
            message:"fetched replies successfully",
            results:posts
        })
    }else{
        res.status(500).send("Internal server error")
    }
}

async function postComment(req, res) {
    const { post_id } = req.params;
    const { user_id, content } = req.body;

  let pool = req.pool;
  if(pool.connected){
    let results = await pool.request()
                        .input("post_id",post_id)
                        .input("user_id",user_id)
                        .input("content",content)
                        .execute("dbo.InsertComment")
       
         console.log(results)
        results.rowsAffected.length ? res.send({ success: true,
           message: 'Saved Comment',
           commentContent:content
          }) :
            res.send({ success: false, message: 'An error occurred' })


}
}
async function postReply(req, res) {
    const { post_id, comment_id } = req.params;
    const { user_id, content } = req.body;

    console.log(comment_id)
  let pool = req.pool;
  if(pool.connected){
    let results = await pool.request()
                        .input("commentId",comment_id)
                        .input("postId",post_id)
                        .input("userId",user_id)
                        .input("content",content)
                        .execute("dbo.InsertReply")
       
         console.log(results)
        
         res.json({
            success: true,
            message: "Reply created successfully",
            data: results.recordsets[0]
        });

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
async function totalLikes(req, res) {
    try {
        // Assuming you have a table called "PostLike" with columns "post_id" and "user_id"
        // and you want to get the total likes count for each post and whether the current user has liked each post
    
        // SQL query to get total likes count for each post and whether the current user has liked each post
        const query = `
          SELECT
            post_id,
            COUNT(*) AS total_likes,
            CASE WHEN EXISTS (SELECT 1 FROM PostLike WHERE post_id = pl.post_id AND user_id = @user_id) THEN 1 ELSE 0 END AS user_liked
          FROM
            PostLike AS pl
          GROUP BY
            post_id
        `;
    
        // Assuming you have a pool connection to your database, you can use it to execute the query
        const pool = req.pool;
        const result = await pool.request().input("user_id", req.query.user_id).query(query);
    
        // Send the response back with the total likes data
        res.json(result.recordset);
      } catch (error) {
        console.error("Error fetching total likes:", error);
        res.status(500).json({
          success: false,
          message: "Failed to fetch total likes",
          error: error.message,
        });
      }
    };
   
    

async function unlikePost(req, res) {
    try {
        let {  user_id,post_id } = req.body;
        const pool = req.pool;

        if (pool.connected) {
            let results = await pool.request()
                .input("post_id", post_id)
                .input("user_id", user_id)
                
                .execute('dbo.UnlikePost');

console.log(req.session.userId);

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
    let {post_id} = req.params;

    let pool = req.pool;
    if(pool.connected){
        let results = await pool.query(`SELECT * from Post WHERE post_id=${post_id}`);
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

  
      async function getPostsCommentsReplies(req, res) {
        try {
          const pool = req.pool;
      
          const result = await pool.query(`
          SELECT
          p.post_id,
          p.content AS post_content,
          p.image AS post_image,
          p.user_id AS post_user_id,
          p.timestamp AS post_timestamp,
          p.isDeleted AS post_isDeleted,
          c.comment_id,
          c.content AS comment_content,
          c.user_id AS comment_user_id,
          r.reply_id,
          r.content AS reply_content,
          r.user_id AS reply_user_id,
          u_post.firstname AS post_firstname,
          u_post.lastname AS post_lastname,
          u_post.username AS post_username,
          u_post.profile_pic_url AS post_profile_pic_url,
          u_post.cover_pic_url AS post_cover_pic_url,
          u_post.contact_no AS post_contact_no,
          u_post.address AS post_address,
          u_post.bio AS post_bio,
          u_post.relationship_status AS post_relationship_status,
          u_post.gender AS post_gender,
          u_comment.firstname AS comment_firstname,
          u_comment.lastname AS comment_lastname,
          u_comment.username AS comment_username,
          u_comment.profile_pic_url AS comment_profile_pic_url,
          u_comment.cover_pic_url AS comment_cover_pic_url,
          u_comment.contact_no AS comment_contact_no,
          u_comment.address AS comment_address,
          u_comment.bio AS comment_bio,
          u_comment.relationship_status AS comment_relationship_status,
          u_comment.gender AS comment_gender,
          u_reply.firstname AS reply_firstname,
          u_reply.lastname AS reply_lastname,
          u_reply.username AS reply_username,
          u_reply.profile_pic_url AS reply_profile_pic_url,
          u_reply.cover_pic_url AS reply_cover_pic_url,
          u_reply.contact_no AS reply_contact_no,
          u_reply.address AS reply_address,
          u_reply.bio AS reply_bio,
          u_reply.relationship_status AS reply_relationship_status,
          u_reply.gender AS reply_gender
        FROM Post AS p
        LEFT JOIN Comment AS c ON p.post_id = c.post_id
        LEFT JOIN Reply AS r ON c.comment_id = r.comment_id
        LEFT JOIN UsersProfile AS u_post ON u_post.user_id = p.user_id
        LEFT JOIN UsersProfile AS u_comment ON u_comment.user_id = c.user_id
        LEFT JOIN UsersProfile AS u_reply ON u_reply.user_id = r.user_id
        WHERE p.isDeleted = 0
        ORDER BY p.timestamp DESC,c.timestamp DESC,r.timestamp;
        
          `);
      // Process the SQL result into nested array format
      const nestedPosts = [];
      let currentPost;
      let currentComment;
  
      for (const row of result.recordset) {
        if (!currentPost || currentPost.post_id !== row.post_id) {
          currentPost = {
            post_id: row.post_id,
            post_content: row.post_content,
            post_image: row.post_image,
            post_timestamp: row.post_timestamp,
            post_isDeleted: row.post_isDeleted,
            post_user_id: row.post_user_id,
            user: {
              firstname: row.post_firstname,
              lastname: row.post_lastname,
              username: row.post_username,
              profile: {
                profile_pic_url: row.post_profile_pic_url,
                cover_pic_url: row.post_cover_pic_url,
                contact_no: row.post_contact_no,
                address: row.post_address,
                bio: row.post_bio,
                relationship_status: row.post_relationship_status,
                gender: row.post_gender,
              },
            },
            comments: [],
          };
          nestedPosts.push(currentPost);
        }
  
        if (row.comment_id && (!currentComment || currentComment.comment_id !== row.comment_id)) {
          currentComment = {
            comment_id: row.comment_id,
            comment_content: row.comment_content,
            comment_user_id: row.comment_user_id,
            user: {
              firstname: row.comment_firstname,
              lastname: row.comment_lastname,
              username: row.comment_username,
              profile: {
                profile_pic_url: row.comment_profile_pic_url,
                cover_pic_url: row.comment_cover_pic_url,
                contact_no: row.comment_contact_no,
                address: row.comment_address,
                bio: row.comment_bio,
                relationship_status: row.comment_relationship_status,
                gender: row.comment_gender,
              },
            },
            replies: [],
          };
          currentPost.comments.push(currentComment);
        }
  
        if (row.reply_id) {
          currentComment.replies.push({
            reply_id: row.reply_id,
            reply_content: row.reply_content,
            reply_user_id: row.reply_user_id,
            user: {
              firstname: row.reply_firstname,
              lastname: row.reply_lastname,
              username: row.reply_username,
              profile: {
                profile_pic_url: row.reply_profile_pic_url,
                cover_pic_url: row.reply_cover_pic_url,
                contact_no: row.reply_contact_no,
                address: row.reply_address,
                bio: row.reply_bio,
                relationship_status: row.reply_relationship_status,
                gender: row.reply_gender,
              },
            },
          });
        }
      }
  
      // Send the nestedPosts as a response back to the client
      res.json(nestedPosts);
    } catch (err) {
      console.error("Error fetching posts, comments, and replies:", err);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  }
  
  
  
  

  
  
  // Export the function to be used in your Express route handler
  
module.exports = {getAllPosts,totalLikes,createPost,deletePost,likePost,unlikePost,getPostById,updatePost,GetProfileContentByUserId,getPostsCommentsReplies,getAllRepliesByCommentId,getCommentsByPost,postComment,postReply}