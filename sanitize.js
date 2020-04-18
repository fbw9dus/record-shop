const validatorjs = require('validator')

const myEmail = "MaximNachname@googlemail.com"

const sanitizedEmail = validatorjs.normalizeEmail(myEmail)

const name = " Maxim   "

const sanitizedName = validatorjs.trim(name)

console.log(sanitizedName)