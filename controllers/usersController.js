
const mailer               = require('nodemailer');
const { validationResult } = require('express-validator');
const createError          = require("http-errors");

const User = require('../models/User');

const { SHA512 } = require('../lib/crypto.js');
const encryption = require('../lib/validation/encryption')

// Der transporter ist ein teil von nodemailer
//   seine aufgabe ist es eMails zu verschicken
//   dafür braucht er die zugangsdaten von einem
//   echten eMail-postfach
const transporter = mailer.createTransport({
  host: process.env.MAIL_SERVER,      // der mailserver
  port: process.env.MAIL_PORT || 465, // mailserver port
  auth:{
    user: process.env.MAIL_USER,      // benutzername
    pass: process.env.MAIL_PASS       // passwort
  }
});

// wenn der benutyer einen Link bekommt um sein passwort zu resetten
//   oder sein konto zu aktivieren, soll dieser link nur (tokenTimeout)
//   millisekunden gültig sein
const tokenTimeout = 3600000; // in millisekunden

//  benutze die SHA512 hashfunktion damit ein einheitlicher,
//  unleserlicher String herauskommt
//      "!record-shop!!!" : salt (sollte für jede Seite anders sein)
//      Date.now()        : verändert sich laufend (zufallsfaktor)
//      user.email        : eindeutigkeit für user
// ae97658ea6547ea3447ea5f37e3a7e3a54e365a4e3f65ae365e3a65ef365ae33ae653

function localHash(data){
  return SHA512( "!record-shop!!!" + Date.now() + data );
}

/*
 ██████  ███████ ████████
██       ██         ██
██   ███ █████      ██
██    ██ ██         ██
 ██████  ███████    ██
*/

const { getPaginatedList } = require('./abstractControllers');

exports.getUsers = getPaginatedList(User);

/*
 ██████  ███████ ████████
██       ██         ██
██   ███ █████      ██
██    ██ ██         ██
 ██████  ███████    ██
*/

exports.getUser = async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  // Schreib hier code um den Kunden mit der id aus params aus der users-Collection zu holen

  const u = await User
    .findById(id)
    .populate('orders');

  if ( user.role === "Admin" || user.id === u.id ){
    res.status(200).send(u);
  }

  else if ( user ){
    const { firstName, lastName } = u;
    res.status(200).send({ firstName, lastName });
  }

};

/*
██████  ███████ ██      ███████ ████████ ███████
██   ██ ██      ██      ██         ██    ██
██   ██ █████   ██      █████      ██    █████
██   ██ ██      ██      ██         ██    ██
██████  ███████ ███████ ███████    ██    ███████
*/

exports.deleteUser = (req, res, next) => {
  const { id } = req.params;
  // Schreib hier code um den Kunden mit der id aus params aus der users-Collection zu löschen
  const user = User.findByIdAndDelete(id).select("-password")
  res.status(200).send(user);
};

/*
██    ██ ██████  ██████   █████  ████████ ███████
██    ██ ██   ██ ██   ██ ██   ██    ██    ██
██    ██ ██████  ██   ██ ███████    ██    █████
██    ██ ██      ██   ██ ██   ██    ██    ██
 ██████  ██      ██████  ██   ██    ██    ███████
*/

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select("-password");
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

/*
 █████  ██████  ██████
██   ██ ██   ██ ██   ██
███████ ██   ██ ██   ██
██   ██ ██   ██ ██   ██
██   ██ ██████  ██████
*/

exports.addUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let user = req.body;
    user.role  = "User";
    user.email = user.email.toLowerCase();

    await User.init();
    user = new User(user);

    // generiere ein Token für die aktivierungs email
    const token = localHash( user.email );
    user.activationLink = token;
    user.activationDate = new Date();

    // speichere den user in der datenbank
    try {
      await user.save()
    } catch (error){
      console.error("registration: user exists", user.email);
      console.error(error);
      throw new Error('name is taken');
    }

    // sende eMail
    transporter.sendMail({
      to:       user.email,
      from:    'record-shop@hktr.de',
      subject: `Aufgabe Auth`,
      html: `
      <h1>${user.firstName} ${user.lastName} hat es geschafft!</h1>
      <p>Nutzen sie jetzt unsere ...</p>
      <a href="http://localhost:3000/activate/${token}">
        Jetzt Aktivieren
      </a>`
    }, (err,info)=> console.log( 'mail', err, info ) )

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    next(error)
  }

};

/*
██       ██████   ██████  ██ ███    ██
██      ██    ██ ██       ██ ████   ██
██      ██    ██ ██   ███ ██ ██ ██  ██
██      ██    ██ ██    ██ ██ ██  ██ ██
███████  ██████   ██████  ██ ██   ████
*/

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password')

    if ( ! user ) throw new createError.NotFound();

    if ( ! user.activated ) throw new createError.NotFound();

    // important: the result of encryption.compare is a Promise
    //   which is truthy, we need to await to get the real result
    const valid = await encryption.compare(password, user.password)

    if ( valid === false ) {
      user.addFailedLoginAttempt();
      await user.save()
      throw new createError.NotFound();
    }

    // important: check if [valid] is exactly not true
    //   in any other case: bail!
    if ( valid !== true ) throw new createError.NotFound();

    const token = user.generateAuthToken()
    await user.save()

    res
      .status(200)
      .header("x-auth", token)
      .send(user)

  } catch (error) {
    console.error('login error',error);
    next(new createError.NotFound())
  }

}

/*
 █████   ██████ ████████ ██ ██    ██  █████  ████████ ███████
██   ██ ██         ██    ██ ██    ██ ██   ██    ██    ██
███████ ██         ██    ██ ██    ██ ███████    ██    █████
██   ██ ██         ██    ██  ██  ██  ██   ██    ██    ██
██   ██  ██████    ██    ██   ████   ██   ██    ██    ███████
*/

exports.activateUser = async function( req, res, next ){

  // der paramter token kommt aus dem express router
  // da unsere url /activate/:token ist
  const { token } = req.params;

  // suche einen benutzer dessen activationLink gleich dem
  //   token aus dem request ist
  const user = await User.findOne({ activationLink:token });

  if ( user ){

    // ist der aktivierungslink noch gültig?
    if ( // getTime macht aus einem Date-Objekt eine Number (Zahl)
         //   und mit zahlen kann man gut rechenen ;)
        user.activationDate.getTime()   // zeit aus der datenbank
        <                               // ist kleiner
        Date.now() - tokenTimeout       // jetzt - tokenTimeout
    ) throw new createError.NotFound(); // dann is der link ungültig

    // setze user auf aktiviert
    user.activated = true;
    // lösche aktivierungslink und datum
    user.activationLink = null;
    user.activationDate = null;

    // speichere den user
    user.save();
    res.json({status:'success'});

  } else res.status(401).json({status:'failed'});
}

/*
██████  ███████ ███████ ███████ ████████
██   ██ ██      ██      ██         ██
██████  █████   ███████ █████      ██
██   ██ ██           ██ ██         ██
██   ██ ███████ ███████ ███████    ██
*/

exports.resetUserPassword = async function( req, res, next ){

  // der paramter email kommt aus dem express router
  // da unsere url /users/reset/:email ist
  const email = req.params.email;

  // such einen user mit der email addresse aus dem parameter
  const user = await User.findOne({ email:email.toLowerCase() });

  if ( user ){

    // generiere ein Token für die reset email
    const token = localHash( user.email );
    user.resetLink = token;      // token speichern
    user.resetDate = new Date(); // zeitstempel
    user.save();                 // speicere den benutzer

    // sende eMail
    transporter.sendMail({
      to:       user.email,                           // empfänger
      from:    'record-shop@hktr.de',                 // absender
      subject: 'Passwort Zurücksetzen TheRecordShop', // überschrift
      html: `
      <h1>Ihr Account wurde Zurückgesetzt</h1>
      <p>Wenn sie diese eMail nicht erwarten...</p>
      <a href="http://localhost:3000/reset/${token}">
        Jetzt neues Passwort setzen
      </a>`
    }, (err,info)=> console.log( 'mail', err, info ) )
    res.status(200).json({status:'success'});
  } else {
    res.status(404).json({status:'failed'});
  }
}

/*
 ██████ ██   ██  █████  ███    ██  ██████  ███████ ██████  ██     ██
██      ██   ██ ██   ██ ████   ██ ██       ██      ██   ██ ██     ██
██      ███████ ███████ ██ ██  ██ ██   ███ █████   ██████  ██  █  ██
██      ██   ██ ██   ██ ██  ██ ██ ██    ██ ██      ██      ██ ███ ██
 ██████ ██   ██ ██   ██ ██   ████  ██████  ███████ ██       ███ ███
*/

exports.changeUserPassword = async (req, res, next) => {
  try {

    // der paramter token kommt aus dem express router
    // da unsere url /users/changePassword/:token ist
    const token = req.params.token;

    // suche den user dessen resetLink === token ist
    const user = await User.findOne({ resetLink: token });

    if ( ! user )
      throw new createError.NotFound();

    // überprüfe ob der resetlink onch gültig ist
    if ( user.resetDate.getTime() < Date.now() - tokenTimeout )
      throw new createError.NotFound();

    // übernehme neues passwort
    user.password = req.body.password;
    // lösche resetLink und datum
    user.resetLink = null;
    user.resetDate = null;
    // speicere den user
    user.save();
    res.json({status:'success'});
  } catch (e) { next(e); }
};
