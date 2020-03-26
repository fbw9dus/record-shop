
const Orders      = require('../models/Order');

exports.getOrders = async(req, res, next) => {
  const orders    = await Orders.find();

  res.status(200).send(orders);
};

exports.getOrder = async (req, res, next) => {
  const { id }   = req.params;
  const order    = await Orders.findById(id);

  res.status(200).send(order);
};

exports.deleteOrder = async (req, res, next) => {
  const { id }      = req.params;
  const order       = await Orders.findByIdAndDelete(id);

  res.status(200).send(order);
};

exports.updateOrder = async(req, res, next) => {
  const { id }      = req.params;
  const dt          = req.body;
  const order       = await Orders.findByIdAndUpdate(id,dt,{new:true});

  res.status(200).send(order);
};

exports.addOrder  = async(req, res, next) => {
  const orderData = req.body;
  const order     = new Orders(orderData);
  await order.save();
  
  res.status(200).send(order);
};
