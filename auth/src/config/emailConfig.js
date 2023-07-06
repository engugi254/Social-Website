require('dotenv').config()
const email_config = {
    service: 'gmail',
    // host: 'smtp.gmail.com',

    port: 587,

    secure: false,

    requireTLS: true,

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PWD

    },
    // tls: {
    //     ciphers: 'SSLv3'
    // }

}

module.exports = email_config