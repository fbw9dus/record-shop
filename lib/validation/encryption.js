const bcrypt = require("bcrypt")

exports.encrypt = async textPassword => {
    return await bcrypt.hash(textPassword, 10)
}

exports.compare = async (textPassword, hash) => {
    return await bcrypt.compare(textPassword, hash)
}