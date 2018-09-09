var mongoose = require('mongoose');
var Schema = mongoose.Schema;
	
var adminSchema = new Schema({
	_id: String,
	username: String,
	password: String,
});

var userAdmin = mongoose.model('userAdmin', adminSchema);

module.exports = userAdmin;