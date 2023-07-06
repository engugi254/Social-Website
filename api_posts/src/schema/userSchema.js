const joi = require('joi')


const new_user_schema = joi.object({
    firstname: joi.string()
        .min(3)
        .required(),
    lastname: joi.string()
        .min(3)
        .required(),
    username: joi.string()
        .min(3)
        .max(30)
        .required(),
    email: joi.string()
          .min(5)
          .max(50),
    password: joi.string()
        .required()
        .pattern(new RegExp(/^[a-zA-Z0-9]{6,30}$/)),   
    c_password: joi.ref('password')



}).with('password', 'c_password ')


module.exports = { new_user_schema }