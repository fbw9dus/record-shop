const createError = require("http-errors")

module.exports = async (req, res, next) => {
    const role = req.user.role
    if(role !== "Admin") next(new createError.NotFound())
    next()
}