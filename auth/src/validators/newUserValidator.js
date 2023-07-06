const { new_user_schema } = require('../schema/userSchema')


function newUserValidator(body) {



    let user = new_user_schema.validate(body, { abortEarly: false }) //abortEarly in this case is used to handle the case where we want to pass all errors as by leaving it like that will only show us the first error



    if (user.error && user.error.details && user.error.details.length) {

        let message = user.error.details.map((err) => err.message) //for this we pass through each error and return the message
        throw new Error(message.join("\n")) //here we join the message and return the message as a string 
        
    } else {
        return user
    }



}


module.exports = { newUserValidator }