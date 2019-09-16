const express = require('express');
const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = low(adapter);
const { getOrders, getOrder, updateOrder, deleteOrder, addOrder } = require('../controllers/ordersController');


router.
    route('/').   
    get(getOrders).
    post(addOrder);

router.
    route('/:id').   
    get(getOrder).
    delete(deleteOrder).
    put(updateOrder);

module.exports = router;
