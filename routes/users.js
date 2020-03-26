const express        = require("express");
const {userValidationRules} = require('../lib/validation/user/uservalidation');
const router         = express.Router();
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
  .post(userValidationRules,addUser)

router
  .route("/:id")
  .get(getUser)
  .delete(deleteUser)
  .put(updateUser);

module.exports = router;
