
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
                                    .execute("sp_SelectUserByUsername")

                let user = results.recordset[0]
                if(user){
                    req.session.userId = user.user_id; 
                    req.session.authorized = true;


                    let passwords_match = await bcrypt.compare(password,user.password)
                    passwords_match?res.json({success:true, message:"logged in successfully"}):
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
            .input("profile_id",user.profile_id)
                                .input("user_id",user.user_id)
                                .input("profile_pic_url",user.profile_pic)
                                .input("cover_pic_url",user.cover_pic)
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
}

}