const express = require("express");
const router = express.Router();
const {userValidationRules} = require('../lib/validation/userRules')
const {validateInputs} = require('../middleware/validator')
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser
} = require("../controllers/usersController");

router
  .route("/")
  .get(getUsers)
  .post(validateInputs(userValidationRules), addUser);

router
  .route("/:id")
  .get(getUser)
  .delete(deleteUser)
  .put(updateUser);

module.exports = router;
