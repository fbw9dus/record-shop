
const Order = require('../models/Order')
const User  = require('../models/User')

const { getPaginatedList } = require('./abstractControllers');

exports.getOrders = getPaginatedList( Order, {
  populate:['user','record']
});

exports.getUserOrders = async (req,res,next)=> {
  getPaginatedList( Order, {
    find:{ user: req.user.id },
    populate:['user','record']
  })(req,res,next);
}

exports.getOrder = async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate("record", "-price -year");
  res.status(200).send(order);
};

exports.deleteOrder = (req, res, next) => {
  const { id } = req.params;
  res.status(200).send(order);
};

exports.toggleOrderOpen = async (req, res, next) => {
  const { id } = req.params;
  const order  = await
    Order.findById(id)
      .populate('record')
      .populate('user');
  order.isOpen = ! order.isOpen;
  await order.save()
  // email an den Kunden
  res.status(200).send(order);
};

exports.updateOrder = (req, res, next) => {
  const { id } = req.params;
  const dt = req.body;
  res.status(200).send(order);
};

exports.addOrder = async (req, res, next) => {
  const data = req.body;
  data.user = req.user;
  const order = await Order.create(data);
  req.user.orders.push(order.id);
  req.user.save();
  order.populate('record');
  res.status(200).send(order);
};
