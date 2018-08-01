// mongoose.connection.once('open', function() {
// 	console.log('Connection has been made to database');
// }).on('error', function(error) {
// 	console.log(error);
// })

// var mocha = require('mocha'); //testing library
// var assert = require('assert');  //node asset module
// var year = require('../models/appointmentSchedule');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testatroo');

mongoose.connection.once('open', function() {
	console.log('Connection has been made to database');
}).on('error', function(error) {
	console.log(error);
})

beforeEach(function() {
		var year2018 = new year({
		})
		
		year2018.save().then(function() {
			assert(year2018.isNew === false);
		});
	})
var mocha = require('mocha'); //testing library
var assert = require('assert');  //node asset module
var year = require('../models/appointmentSchedule');

describe('Finding Records', function() {
	
	it('Finds one record', function() {
		
		year.findOne({year2018: []})
		
	})
	
})
