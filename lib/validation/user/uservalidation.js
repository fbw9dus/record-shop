const {check} = require('express-validator')

exports.userValidationRules = [
    //check email
    check('email').isEmail(),
    //check first name
    check('firstName').isLength({min:3})
]

