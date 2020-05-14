/*
██████   █████  ███████ ███████ ██████   ██████  ██████  ████████
██   ██ ██   ██ ██      ██      ██   ██ ██    ██ ██   ██    ██
██████  ███████ ███████ ███████ ██████  ██    ██ ██████     ██
██      ██   ██      ██      ██ ██      ██    ██ ██   ██    ██
██      ██   ██ ███████ ███████ ██       ██████  ██   ██    ██
*/

module.exports = function(app){

  const { JWT_KEY }  = process.env;

  const passport     = require('passport');
  const User         = require('../models/User');

  // passport braucht eine middleware bei express
  const passportMiddleware = passport.initialize();
  app.use( passportMiddleware );

  // wandeln ein user objekt in einen string um und zurück
  passport.serializeUser(         ( user,  done )=> done( null, user.email )    );
  passport.deserializeUser( async ( email, done )=> await User.findOne({email}) );

  // sucht in der datanbank nach einem existiend user asu github und combak
  // wenn er existier wird er einfach yurück gegeben
  // wenn nicht wierd er angelegt due filterProfile funktion gibt uns die richtigen daten
  const databaseConnector = (filterProfile)=> async ( accessToken, refreshToken, profile, done )=> {

    // console.log(profile);
    // filter profile gibt uns einen standardisierten benutzer
    const { displayName, imageURL, id, provider } = filterProfile(profile);

    const email = `${id}@${provider}`

    let user = await User.findOne({email});

    // exisiert der user schon? wenn nicht dann neuen anlegen
    if ( ! user ){
      user = new User({
        email,
        displayName,
        imageURL,
        firstName:displayName,
        lastName:displayName,
        password:'!!@ fake @!!',
        role:'User',
        authData: { accessToken, refreshToken },
      });
      await user.save();
    }

    // passport bescheid sagen das der user "user" ist
    done( null, user );
  }

  // array der alle provider enthält
  const providers = ['github','local'];
  
  console.log('passport-power'.yellow.bold, providers.join(" "));

  providers.forEach( ( provider )=>{

    // jeder provider ist in einer eigenen date untergebracht
    let {
      Strategy, Config, filterProfile, // normaler plugin
      StrategyInstance, Routes         // local
    } = require( './' + provider );

    if ( StrategyInstance ){ Routes( app ) }
    else {
      StrategyInstance = new Strategy(
        { ...Config,
          callbackURL: `http://localhost:3001/auth/${provider}/callback`
        },
        databaseConnector(filterProfile)
      );
      app.get(`/auth/${provider}`, passport.authenticate(provider) );
      app.get(`/auth/${provider}/callback`,
        passport.authenticate( provider ),
        ( req, res )=> {
          const { id, displayName } = req.user;
          const token = req.user.generateAuthToken()
          res.redirect('http://localhost:3000/token/' + token);
        }
      );
    }

    passport.use( provider, StrategyInstance );

  });
}
