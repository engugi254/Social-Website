const mssql = require('mssql')
const config = require('../config/config')



async function insertLike(req, res) {
    const { user_id, post_id } = req.params;

  let pool = req.pool;
  if(pool.connected){
    try{
    const existingLike = await pool.query(
        "SELECT isLiked FROM PostLike WHERE post_id = @post_id AND user_id = @user_id",
        { post_id, user_id }
      );
  
      // Determine the new value of isLiked (toggle the value)
      const newIsLiked = existingLike[0]?.isLiked === 1 ? 0 : 1;
  
      // Update the isLiked column in the database
      await pool.query("UPDATE PostLike SET isLiked = @newIsLiked WHERE post_id = @post_id AND user_id = @user_id", {
        post_id,
        user_id,
        newIsLiked,
      });
  
      // Count the total likes for the post
      const totalLikes = await pool.query("SELECT COUNT(*) AS count FROM posts WHERE post_id = @post_id AND isLiked = 1", { post_id });
  
      res.json({ success: true, totalLikes: totalLikes[0].count });
    } catch (error) {
      console.error("Error while liking/unliking post:", error);
      res.status(500).json({ error: "An error occurred while liking/unliking post." });
    }


}
}

async function getAllNotifications(req,res){
    const{id} = req.params;

    let pool = req.pool;
    if(pool.connected){
        let results = await pool.query(`SELECT
        n.notification_id,
        n.user_id,
        n.source_user_id,
        n.type,
        n.timestamp,
        u.username AS sender_username
      FROM Notifications AS n
      JOIN Users AS u ON n.source_user_id = u.user_id
      WHERE n.user_id = ${id}
      ORDER BY n.timestamp DESC;`);
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
async function getFollowerCount(req, res) {
    const { id } = req.params;
  
    let pool = req.pool;
    if (pool.connected) {
      try {
        let results = await pool.query(
          `SELECT COUNT(FollowerID) as followerCount FROM dbo.Followers WHERE user_id = ${id}`
        );
        let followerCount = results.recordset[0]?.followerCount || 0;
        res.json({
          success: true,
          message: "Fetched follower count successfully",
          followerCount: followerCount,
        });
      } catch (error) {
        console.error("Error while fetching follower count:", error);
        res.status(500).send("Internal server error");
      }
    } else {
      res.status(500).send("Internal server error");
    }
  }
  
async function getFollowingCount(req, res) {
    const { id } = req.params;
  
    let pool = req.pool;
    if (pool.connected) {
      try {
        let results = await pool.query(
          `SELECT COUNT(FollowingID) as followingCount FROM dbo.Following WHERE user_id = ${id}`
        );
        let followingCount = results.recordset[0]?.followingCount || 0;
        res.json({
          success: true,
          message: "Fetched following count successfully",
          followingCount: followingCount,
        });
      } catch (error) {
        console.error("Error while fetching following count:", error);
        res.status(500).send("Internal server error");
      }
    } else {
      res.status(500).send("Internal server error");
    }
  }
  

async function getUnReadNotifications(req,res){
    const{id} = req.params;

    let pool = req.pool;
    if(pool.connected){
        let results = await pool.query(`SELECT * from dbo.Notification WHERE user_id = ${id} AND isRead=0`);
        let posts = results.recordset;
        res.json({
            success:true,
            message:"All unread Notifications fetched successfully",
            results:posts
        })
    }else{
        res.status(500).send("Internal server error")
    }
}

async function getUserById(req,res){
  const { user_id } = req.params;
  let pool = req.pool;
  if (pool.connected) {
    try {
      const query = `SELECT username FROM Users WHERE user_id = @user_id`;
      const result = await pool.request().input('user_id', user_id).query(query);
      const posts = result.recordset;
      res.json({
        success: true,
        message: "Getting user successfully",
        results: posts
      });
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Internal server error");
    }
  } else {
    res.status(500).send("Internal server error");
  }
}

async function markAsRead(req, res) {
    const { notificationId } = req.params;
  
    let pool = req.pool;
    if (pool.connected) {
      try {
        let results = await pool
          .request()
          .input('notificationId', notificationId) // Add the 'notificationId' parameter and its value
          .execute('dbo.MarkNotificationAsRead');
  
        // You may not need to fetch any records here as the stored procedure doesn't return records.
        // If you want to return the updated notification, you'll need to fetch it separately.
  
        res.json({
          success: true,
          message: "Notification marked as read successfully",
        });
      } catch (error) {
        console.error("Error while marking notification as read:", error);
        res.status(500).json({
          success: false,
          message: "An error occurred while marking notification as read",
        });
      }
    } else {
      res.status(500).send("Internal server error");
    }
  }
  




module.exports = {getFollowerCount,getUserById,getFollowingCount,insertLike,getAllNotifications,getUnReadNotifications,markAsRead}