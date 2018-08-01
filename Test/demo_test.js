var mocha = require('mocha'); //testing library
var assert = require('assert');  //node asset module

//Describe tests
describe('some demo tests', function() {
	//Create tests
	it('adds two numbers', function() {
		assert(2 + 3 === 5);
	})

})