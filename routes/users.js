
const express = require("express");
const router = express.Router();

const User = require('../models/User');

const {userValidationRules} = require('../lib/validation/userRules')
const {validateInputs}      = require('../middleware/validator')

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser,
  loginUser,
  activateUser,
  resetUserPassword,
  changeUserPassword
} = require("../controllers/usersController");

const requireAuth = require('../middleware/authenticator');
const {
  requireAdmin,
  requireAdminOrSelf
} = requireAuth;

router
  .route("/")
  .get(requireAdmin, getUsers)
  .post(validateInputs(userValidationRules), addUser);

router
  .post("/login",loginUser)
  .get("/activate/:token",activateUser)
  .get("/reset/:email",resetUserPassword)
  .put("/changePassword/:token",changeUserPassword)

router
  .route("/:id")
  .get(    requireAuth,        getUser)
  .delete( requireAdminOrSelf, deleteUser)
  .put(    requireAdminOrSelf, updateUser);

module.exports = router;
