// OrderItem DB Model

var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

var OrderItemSchema = new mongoose.Schema({  
    quantity: Number,
    pizzaId: {type: Schema.Types.ObjectId, ref: 'Pizza'}
});

mongoose.model('OrderItem', OrderItemSchema);
module.exports = mongoose.model('OrderItem');