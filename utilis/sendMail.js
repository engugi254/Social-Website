const { createTransport } = require("nodemailer");
require('dotenv').config();
const email_config = require('../config/emailConfig');

const transporter = createTransport(email_config);




async function sendMail(user_Email, subject, text) {

  const confirmationLink = "https://samrexenterprises.co.ke/confirm-email";

  const imageUrl = "https://marketplace.canva.com/EAFQrKjwiGw/1/0/1600w/canva-blue-modern-instagram-profile-picture-yV5S_FMQho0.jpg";

 

  const message_options = {

    from: process.env.EMAIL_USER,

    to: user_Email,

    subject: subject,

 

    html: `

      <p>${text}</p>

      <p>Click <a href="${confirmationLink}">here</a> to confirm your email.</p>

      <img src="${imageUrl}" alt="Welcome Image" />

    `

  };


  try {

    let results = await transporter.sendMail(message_options);

    console.log(results);

  } catch (error) {

    console.log(error);

  }

}

//sign up
async function sendMailRegisterUser(email, Name) {
  const messageOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Welcome to SocialHub",
      text: `Dear ${Name},

      We are delighted to welcome you to Social Hub community!
  
      Thank you for registering with our social media platform! We are excited to have you on board.
       You can now start exploring our platform and connecting with your friends and family.
        If you have any questions or concerns, please don’t hesitate to contact us at support@socialhub.com.

      Best regards, 
      Social Hub `


  }


  try {
      let results = await transporter.sendMail(messageOptions)

      console.log(results)
  } catch (error) {
      console.log(error)
  }
}


module.exports ={sendMail,sendMailRegisterUser} ;