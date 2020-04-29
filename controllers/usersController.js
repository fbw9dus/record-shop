const User = require('../models/User')
const {validationResult} = require('express-validator')
const createError = require("http-errors")
const encryption = require('../lib/validation/encryption')

exports.getUsers = async (req, res, next) => {
  // Schreib hier code um alle Kunden aus der users-Collection zu holen
  const users = await User.find()
  res.status(200).send(users);
};

exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  // Schreib hier code um den Kunden mit der id aus params aus der users-Collection zu holen
  const user = await User.findById(id)
  res.status(200).send(user);
};

exports.deleteUser = (req, res, next) => {
  const { id } = req.params;
  // Schreib hier code um den Kunden mit der id aus params aus der users-Collection zu löschen

  res.status(200).send(user);
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const user = req.body;
    user.email = user.email.toLowerCase();
    console.log('registered', req.body);
    // Schreib hier code um die Daten des neuen Kunden aus req.body in der users-Collection zu speichern
    await User.init()
    const newUser = new User(user)
    await newUser.save()
    res.status(200).send(newUser);
  } catch (error) {
    next(error)
  }

};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password')

    if ( ! user ) throw new createError.NotFound();

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
