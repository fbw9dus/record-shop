const User = require('../models/User')
const {validationResult} = require('express-validator')
const createError = require("http-errors")
const encryption = require('../lib/validation/encryption')

exports.getUsers = async (req, res, next) => {
  // Schreib hier code um alle Kunden aus der users-Collection zu holen
  const users = await User.find()
    .select("-password")
    .sort("lastName")
    .limit(5)
  res.status(200).send(users);
};

exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  // Schreib hier code um den Kunden mit der id aus params aus der users-Collection zu holen
  const user = await User.findById(id).select("-password")
  res.status(200).send(user);
};

exports.deleteUser = (req, res, next) => {
  const { id } = req.params;
  // Schreib hier code um den Kunden mit der id aus params aus der users-Collection zu löschen
  const user = User.findByIdAndDelete(id).select("-password")
  res.status(200).send(user);
};

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

exports.addUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const user = req.body;
    // Schreib hier code um die Daten des neuen Kunden aus req.body in der users-Collection zu speichern
    await User.init()
    const newUser = new User(user)

    const token = newUser.generateAuthToken()

    await newUser.save()
    res
      .status(200)
      .header("x-auth", token)
      .send(newUser);
  } catch (error) {
    next(error)
  }
  
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body

  try {
    let user = await User.findOne({ email }).select('+password')
    const valid = encryption.compare(password, user.password)

    const token = user.generateAuthToken()
    await user.save()
    
    if(!valid) throw new createError.NotFound()
    user = await User.findOne({ email }).select('-password')
    res
      .status(200)
      .header("x-auth", token)
      .send(user)

  } catch (error) {
    next(error)
  }
  
}