const express = require("express");
const router = express.Router();
const {userValidationRules} = require('../lib/validation/userRules')
const {validateInputs} = require('../middleware/validator')
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

router
  .route("/")
  .get(getUsers)
  .post(validateInputs(userValidationRules), addUser);

router.route("/login")
  .post(loginUser)

router.get("/activate/:token",activateUser)
router
  .get("/reset/:email",resetUserPassword)
  .put("/changePassword/:token",changeUserPassword)

router
  .route("/:id")
  .get(getUser)
  .delete(deleteUser)
  .put(updateUser);

module.exports = router;
