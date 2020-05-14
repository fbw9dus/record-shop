
const passport     = require('passport');
const { Strategy } = require('passport-local');
const User         = require('../models/User');
const encryption   = require('../lib/validation/encryption')

const { JWT_KEY, DB } = process.env;

const StrategyInstance = new Strategy( async ( username, password, done )=> {
  const email = `${username}`;
  let    user = await User.findOne({email}).select('+password');
  if ( ! user )           done( new createError.NotFound() );
  if ( ! user.activated ) done( new createError.NotFound() );
  const valid = await encryption.compare(password, user.password);

  if ( valid === false ) {
    user.addFailedLoginAttempt();
    await user.save()
    throw new createError.NotFound();
    done( 404 );
  }

  if ( valid === true ) done( null, user );
});

const filterProfile = (profile)=> ({ ...profile, provider:'local' })

const { loginUser } = require('../controllers/usersController');

const Routes = (app)=> {
  app.get(`/auth/local/callback`,
    passport.authenticate('local'),
    ( req, res )=> {
      const { id, displayName } = req.user;
      const token = req.user.generateAuthToken()
      req.user.save()
      res.header('x-auth',token).json(req.user)
    }
  );
}

module.exports = { StrategyInstance, Routes, filterProfile }
