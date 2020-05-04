const express = require("express");
const router = express.Router();
const auth = require("../middleware/authenticator")
const isAdmin = require("../middleware/rolesAuthenticator")
const {
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  addOrder
} = require("../controllers/ordersController");

router
  .route("/")
  .get(auth, isAdmin, getOrders)
  .post(auth, addOrder);

router
  .route("/:id")
  .get(auth, getOrder)
  .delete(auth, deleteOrder)
  .put(auth, updateOrder);

module.exports = router;
