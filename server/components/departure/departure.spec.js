var Departure = require('./index');
var expect = require('chai').expect;
var _ = require('lodash');

describe('----Test main function----', function () {

	it('get time tables in valid area', function (done) {
		this.timeout(3000);
		Departure.getTimeTables('11.633139', '52.120076')
			.then(function(timeTables) {
				expect(timeTables).to.be.an('array').and.to.have.length.above(0, 'got no timeTables');
				_.forEach(timeTables, function(timeTable) {
					expect(timeTable.station_info).to.be.a('string').and.to.have.length.above(0, 'timeTable.station_info');
					_.forEach(timeTable.departure_times, function(departure) {
						expect(departure.line).to.be.a('string').and.to.have.length.above(0, 'departure.line');
						expect(departure.departure).to.be.a('string').and.to.have.length.above(0, 'departure.departure');
						expect(departure.direction).to.be.a('string').and.to.have.length.above(0, 'departure.direction');
					});
				});
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