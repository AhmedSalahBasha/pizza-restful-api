// Pizza DB Model

var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

var PizzaSchema = new mongoose.Schema({  
    name: String,
    size: String,
    price: Number
});

/*
PizzaSchema.virtual('price').get(function(){
    
})*/

mongoose.model('Pizza', PizzaSchema);
module.exports = mongoose.model('Pizza');