var mongoose = require('mongoose');
var Schema = mongoose.Schema;
	
var clientSchema = new Schema({
	_id: String,
	firstName: String,
	lastName: String,
	eMail: String,
	date: String,
});

var client = mongoose.model('client', clientSchema);

module.exports = client;