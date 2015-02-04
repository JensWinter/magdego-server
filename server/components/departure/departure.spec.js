var Departure = require('./index');
var expect = require('chai').expect;
var _ = require('lodash');

describe('----Test main function----', function () {

	it('get time tables in valid area', function (done) {
		this.timeout(3000);
		Departure.getTimeTables('11.6289', '52.1308')
			.then(function(timeTables) {
				expect(timeTables).to.be.an('array').and.to.have.length.above(0, 'got no timeTables');
				done();
			})
			.fail(done);
	});

	it('get time tables in invalid area', function (done) {
		this.timeout(3000);
		Departure.getTimeTables('10.016365853434142', '53.554977179573505')
			.then(function(timeTables) {
				expect(timeTables).to.be.an('array').and.to.not.have.length.above(0, 'got timeTables');
				done();
			})
			.fail(done);
	});

});