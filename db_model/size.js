// Size DB Model

var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

var SizeSchema = new mongoose.Schema({  
  
});

mongoose.model('Size', SizeSchema);
module.exports = mongoose.model('Size');