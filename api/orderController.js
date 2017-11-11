// OrderController.js

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
var Order = require('../db_model/order');

// ------------ ORDER --------------
// CREATES A NEW ORDER
router.post('/', function (req, res) {
    Order.create({
        totalPrice : req.body.totalPrice,
        recipient : req.body.recipient,
        orderItems : req.params.id
    }, 
    function (err, newOrder) {
        if (err) return res.status(400).send("Invalid order.");
        res.status(201).send("Created new order successfully.");
    });
});

// RETURN ALL ORDERS FROM DATABASE
router.get('/', function (req, res) {
    Order.find({}, function (err, order) {
        if (err) return res.status(404).send('No orders found.');
        res.status(200).send('found orders. returned are ids')
    });
});

module.exports = router;