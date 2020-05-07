
const Order = require('../models/Order')
const User  = require('../models/User')

exports.getOrders = async (req, res, next) => {
  const orders = await Order.find().populate("record", "-price -year");
  res.status(200).send(orders);
};

exports.getOrder = async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("record", "-price -year");
  res.status(200).send(order);
};

exports.deleteOrder = (req, res, next) => {
  const { id } = req.params;
  res.status(200).send(order);
};

exports.updateOrder = (req, res, next) => {
  const { id } = req.params;
  const dt = req.body;
  res.status(200).send(order);
};

exports.addOrder = async (req, res, next) => {
  const data = req.body;
  const order = await Order.create(data);
  req.user.orders.push(order.id);
  req.user.save();
  order.populate('record');
  res.status(200).send(order);
};
