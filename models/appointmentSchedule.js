var mongoose = require('mongoose');
var Schema = mongoose.Schema;
	
var scheduleSchema = new Schema({
	_id: String,
	scheduleArray: Object,
});

var schedule = mongoose.model('schedule', scheduleSchema);

module.exports = schedule;