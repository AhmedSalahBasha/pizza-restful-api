// PizzaController.js

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

var db = require('../db_model/db_models');  // import DB_MODELS

//var Size = require('../db_model/size'); // Size model
//var Pizza = require('../db_model/pizza');  // Pizza model
//var Topping = require('../db_model/topping'); // Topping model

// =========== ROUTES ==============
// ----------- SIZE ----------------
// CREATES A NEW SIZE
/*
router.post('/size', function (req, res) {
    Size.create({
            name : req.body.name
        }, 
        function (err, size) {
            if (err) return res.status(500).send("Invalid input.");
            res.status(200).send(size);
        });
});*/

// SELECT .... FROM .... WHERE 
// db.get("SELECT * FROM phone WHERE id = ? AND id_contact = ?",  [req.params.id_phone, req.params.id_contact], function(err, row)

// RETURNS ALL THE SIZES IN THE DATABASE

router.get('/size', function (req, res) {
    res.setHeader("Content-Type", "application/json");

    db.all("SELECT * FROM Size", function (err, row) {
        if (err) { return res.status(500).send(err); }
        res.status(200).send(row);
    })
});

// ------------ PIZZA --------------
// CREATES A NEW PIZZA
router.post('/', function (req, res) {
    Pizza.create({
        name : req.body.name,
        size : req.body.size,
        price : req.body.price
    }, 
    function (err, newPizza) {
        if (err) return res.status(500).send("Invalid input.");
        res.status(200).send("Created new pizza.");
    });
});

// RETURNS ALL THE PIZZAS IN THE DATABASE
router.get('/', function (req, res) {
    Pizza.find({}, function (err, pizza) {
        if (err) return res.status(404).send("No pizzas exist.");
        res.status(200).send("Successful Operation");
    });
});

// RETURNS PIZZA BY ID
router.get('/:id', function (req, res) {
    Pizza.find({}, function (err, pizzas) {
        if (err) return res.status(404).send("No pizzas exist.");
        res.status(200).send("Successful Operation");
    });
});

// UPDATE PIZZA BY ID
router.put('/:id', function (req, res) {
    Pizza.findByIdAndUpdate(req.params.id, function (err, pizza) {
        if (err) return res.status(404).send("Pizza not found");
        res.status(204).send("Update okay");
    });
});

// DELETE PIZZA BY ID
router.put('/:id', function (req, res) {
    Pizza.findByIdAndRemove(req.params.id, function (err, pizza) {
        if (err) return res.status(404).send("Pizza not found");
        res.status(204).send("deleted");
    });
});



module.exports = router;