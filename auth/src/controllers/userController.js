
const bcrypt = require('bcrypt');

const { newUserValidator } = require('../validators/newUserValidator')
const { sendMailRegisterUser } = require('../utils/sendMail')


module.exports = {
    postUser:async(req,res)=>{
        let user = req.body;


          // let valid_user = newUserValidator(user) 
        let { value } = newUserValidator(user) //we can just destructure this to get the value of what we are passing to the database in this case the fullName, contactNumber, address and password//remember we got rid of the if(sql.connected) block since by now we have handled all the errors and have a legit user
          console.log(value)
        let hashed_pwd = await bcrypt.hash(user.password,8)

        let pool = req.pool;

        try{

        if(pool.connected){
            let results = await pool.request()
                                .input("firstname",value.firstname)
                                .input("lastname",value.lastname)
                                .input("username",value.username)
                                .input("email",value.email)
                                .input("password",hashed_pwd)
                                .execute("dbo.InsertUser")
               
                 console.log(results)
                results.rowsAffected.length ? res.send({ success: true, message: 'Saved User' }) :
                    res.send({ success: false, message: 'An error occurred' })


                    sendMailRegisterUser(value.email, value.username)
        }
    }catch(error){
        res.send(error.message)
    }
    },

    loginUser:async(req,res)=>{
        let{ username, password } = req.body;
        try{
            const pool = req.pool;
            if(pool.connected){


                let results = await pool.request()
                                    .input("username",username)
                                    .execute("dbo.sp_SelectUserByUsername")

                let user = results.recordset[0]
    
                if(user){

                    let passwords_match = await bcrypt.compare(password,user.password)
                    if(passwords_match){
                    req.session.userId = user.user_id; 
                    req.session.authorized = true;
                }
                    
   
                    passwords_match?res.json({success:true,
                         message:"logged in successfully",
                         userId:user.user_id
                        }):
                    res.status(401).json({success:false, message:"wrong credentials"})
                }
                else{
                    res.status(404).json({success:false,message:"No user Found"})
                }

               
            }
            else{
                res.status(500).json({success:false,message:"Internal server error"})
            }
        }catch(error){

        }
    },
    deleteUser:async(req,res)=>{
        try {
            const { username } = req.body;
            const pool = req.pool;
    
            if (pool.connected) {
                const result = await pool.request()
                    .input("username", username)
                    .execute("dbo.SoftDeleteUser");
    
                // Check if any rows were affected by the deletion
                if (result.rowsAffected[0] > 0) {
                    res.json({
                        success: true,
                        message: "User Account deleted successfully",
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
    },
    addProfile:async(req,res)=>{
        let user = req.body;

        let pool = req.pool;

        try{

        if(pool.connected){
            let results = await pool.request()
                                .input("user_id",user.user_id)
                                .input("profile_pic_url",user.profile_pic_url)
                                .input("cover_pic_url",user.cover_pic_url)
                                .input("contact_no",user.contact_no)
                                .input("address",user.address)
                                .input("bio",user.bio)
                                .input("relationship_status",user.relationship_status)
                                .input("gender",user.gender)
                                .execute("dbo.AddUserDetails")
               
                 console.log(results)
                results.rowsAffected.length ? res.send({ success: true, message: 'Saved User' }) :
                    res.send({ success: false, message: 'An error occurred' })

        }
    }catch(error){
        res.send(error.message)
    }
},

updateProfile: async(req, res)=> {
    try {
        const user = req.body;
        const pool = req.pool;

        if (pool.connected) {
            const result = await pool.request()
            .input("user_id",user.user_id)
            .input("profile_pic_url",user.profile_pic_url)
            .input("cover_pic_url",user.cover_pic_url)
            .input("contact_no",user.contact_no)
            .input("address",user.address)
            .input("bio",user.bio)
            .input("relationship_status",user.relationship_status)
            .input("gender",user.gender)
            .execute("dbo.updateProfile")

            // Check if any rows were affected by the deletion
            if (result.rowsAffected[0] > 0) {
                res.json({
                    success: true,
                    message: "Profile updated successfully",
                    userId: req.session.userId
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Error updating Profile",
                });
            }
        } else {
            throw new Error("Internal Error");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update Profile",
            error: error.message,
        });
    }
},

updateProfilePic: async(req, res)=> {
    try {
        const user = req.body;
        const pool = req.pool;

        if (pool.connected) {
            const result = await pool.request()
            .input("user_id",user.user_id)
            .input("profile_pic_url",user.profile_pic_url)
            
            .execute("dbo.updateProfile")

            // Check if any rows were affected by the deletion
            if (result.rowsAffected[0] > 0) {
                res.json({
                    success: true,
                    message: "Profile updated successfully",
                    userId: req.session.userId
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Error updating Profile",
                });
            }
        } else {
            throw new Error("Internal Error");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update Profile",
            error: error.message,
        });
    }
},

getProfile:async(req,res)=>{
    let {user_id} = req.params;

    let pool = req.pool;
    if(pool.connected){
        let results = await pool.request()
        .input("user_id",user_id)
        .execute('dbo.GetCombinedData');
        let posts = results.recordset[0];
        res.json({
            success:true,
            message:"Getting profile successfully",
            results:posts
        })
    }else{
        res.status(500).send("Internal server error")
    }
},

showFollowers:async(req,res)=>{
    let {id} = req.params;

    let pool = req.pool;
    if(pool.connected){
        let results = await pool.query(`SELECT * from dbo.Followers WHERE user_id=${id}`);
        let posts = results.recordset;
        res.json({
            success:true,
            message:"Getting followers successfully",
            results:posts
        })
    }else{
        res.status(500).send("Internal server error")
    }
},
showUsers:async(req,res)=>{

    let pool = req.pool;
    if(pool.connected){
        let results = await pool.query(`SELECT username FROM users`);
        let posts = results.recordset;
        res.json({
            success:true,
            message:"Getting user successfully",
            results:posts
        })
    }else{
        res.status(500).send("Internal server error")
    }
},
showUserById: async (req, res) => {
    const { username } = req.params;
    let pool = req.pool;
    if (pool.connected) {
      try {
        const query = `SELECT * FROM Users 
        u INNER JOIN Profile p ON u.user_id = p.user_id
         WHERE username = @username`;
        const result = await pool.request().input('username', username).query(query);
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
  

}