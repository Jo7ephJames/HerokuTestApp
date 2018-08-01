var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testatroo');
var mocha = require('mocha'); //testing library
var assert = require('assert');  //node asset module
var year = require('../models/appointmentSchedule');
mongoose.connection.once('open', function() {
	console.log('Connection has been made to database');
}).on('error', function(error) {
	console.log(error);
})

beforeEach(function() {
	mongoose.connection.collections.years.drop(function() {
		console.log('Database Refreshed')
	})
})




describe('Saving Records', function() {
	it('Saves a schedule to the database', function() {
		
		var year2018 = new year({
		})
		
		year2018.save().then(function() {
			assert(year2018.isNew === false);
		});
	})
})
