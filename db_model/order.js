// Order DB Model

var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};


var OrderSchema = new mongoose.Schema({
  totalPrice: Number,
  orderItems: {type: Schema.Types.ObjectId, ref: 'OrderItem'},
  recipient: {
    type: String,
    lowercase: true,
    unique: true,
    validate: [validateEmail, 'Please fill a valid email address']
  }
  
});

mongoose.model('Order', OrderSchema);
module.exports = mongoose.model('Order');