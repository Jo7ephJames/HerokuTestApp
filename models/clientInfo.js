var mongoose = require('mongoose');
var Schema = mongoose.Schema;
	
var clientInfoSchema = new Schema({
	_id: String,
	firstName: String,
	lastName: String,
	eMail: String,
});

var clientInfo = mongoose.model('clientInfo', clientInfoSchema);

module.exports = clientInfo;