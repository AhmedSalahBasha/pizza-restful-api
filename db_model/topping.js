// Topping DB Model

var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

var ToppingSchema = new mongoose.Schema({  
    name: String,
    price: Number
});

mongoose.model('Topping', ToppingSchema);
module.exports = mongoose.model('Topping');