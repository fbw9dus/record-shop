
const express = require("express");
const router = express.Router();

const User = require('../models/User');

const {userValidationRules} = require('../lib/validation/userRules')

const {validateInputs} = require('../middleware/validator')
const auth = require("../middleware/authenticator")
const isAdmin = require("../middleware/rolesAuthenticator")

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser,
  activateUser,
  resetUserPassword,
  changeUserPassword
} = require("../controllers/usersController");

router
  .route("/")
  .get( auth, isAdmin, getUsers )
  .post( validateInputs(userValidationRules), addUser);

router
  .get("/activate/:token",activateUser)
  .get("/reset/:email",resetUserPassword)
  .put("/changePassword/:token",changeUserPassword)

router
  .route("/:id")
  .get( auth, getUser )
  .delete( auth, isAdmin, deleteUser )
  .put( auth, updateUser );

module.exports = router;
