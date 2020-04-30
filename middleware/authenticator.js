const User = require('../models/User')
const createError = require('http-errors')

module.exports = async (req, res, next) => {
  const token = req.header("x-auth")
  try {
      const user = await User.findByToken(token)
      if(!user) throw new createError.NotFound()
      req.user = user;
      next()
  } catch (error) {
      next(error)
  }
}

module.exports.requireAdmin = async (req,res,next)=> {
  const token = req.header("x-auth");
  try {
      const user = await User.findByToken(token);
      if( ! user ) throw new Error('not authorized');
      if( ! user.group.includes('admin') ) throw new Error('admin only');
      req.user = user;
      next();
  } catch (error) {
      console.error(error);
      next(error)
  }
}

module.exports.requireAdminOrSelf = async (req,res,next)=> {
  const token = req.header("x-auth");
  try {
      const user = await User.findByToken(token);
      if( ! user ) throw new Error('not authorized');
      if( ! ( user.group.includes('admin') ||
              user.id === req.params.id )
      ) throw new Error('admin / owner only');
      req.user = user;
      next();
  } catch (error) {
      console.error(error);
      next(error)
  }
}
