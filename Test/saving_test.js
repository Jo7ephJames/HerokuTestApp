var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testatroo');

mongoose.connection.once('open', function() {
	console.log('Connection has been made to database');
}).on('error', function(error) {
	console.log(error);
})

beforeEach(function() {
	mongoose.connection.collections.mariochars.drop(function() {
		console.log('Database Refreshed for Mario')
	})
})

var mocha = require('mocha'); //testing library
var assert = require('assert');  //node asset module
var MarioChar = require('../models/mariochar');

describe('Saving Records', function() {
	it('Saves a record to the database', function() {
		
		var char1 = new MarioChar({
			name: 'Mario'
		})
		
		char1.save().then(function() {
			assert(char1.isNew === false);
		});

		var char2 = new MarioChar({
			name: 'Luigi'
		})
		
		char2.save().then(function() {
			assert(char2.isNew === false);
		});
	})
})


