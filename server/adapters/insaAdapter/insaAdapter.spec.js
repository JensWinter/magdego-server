var InsaAdapter = require('./index');
var expect = require('chai').expect;
var _ = require('lodash');

describe('----Test insaAdapter----', function () {

	var validExtIdOfStation = '7393';

	var assertStations = function(responseBody) {
		expect(responseBody.stops).to.exist();

		_.forEach(responseBody.stops, function(station) {
			console.log(station);
			expect(station.x).to.have.length.above(0, 'station.x');
			expect(station.y).to.have.length.above(0, 'station.y');
			expect(station.name).to.have.length.above(0, 'station.name');
			expect(station.urlname).to.have.length.above(0, 'station.urlname');
			expect(parseInt(station.prodclass)).to.be.above(32, 'station.prodclass');
			expect(station.extId).to.have.length.above(0, 'station.extId');
			expect(station.puic).to.have.length.above(0, 'station.puic');
			expect(station.dist).to.have.length.above(0, 'station.dist');
			expect(station.planId).to.have.length.above(0, 'station.planId');
		});
	};

	var assertJourneys = function(responseBody) {
		expect(responseBody.journey).to.exist();

		_.forEach(responseBody.journey, function(journey) {
			console.log(journey);
			expect(journey.lfn).to.have.length.above(0, 'journey.lfn');
			expect(journey.id).to.have.length.above(0, 'journey.id');
			expect(journey.ti).to.have.length.above(0, 'journey.ti');
			expect(journey.da).to.have.length.above(0, 'journey.da');
			expect(journey.ic).to.have.length.above(0, 'journey.ic');
			expect(journey.pr).to.have.length.above(0, 'journey.pr');
			expect(journey.st).to.have.length.above(0, 'journey.st');
			//expect(journey.tr).to.have.length.above(0, 'journey.tr');
			expect(journey.rt).to.have.length.above(0, 'journey.rt');
			expect(journey.tinfo).to.have.length.above(0, 'journey.tinfo');
			expect(journey.tinfoline).to.have.length.above(0, 'journey.tinfoline');
		});
	};

	it('requestStations', function (done) {
		this.timeout(3000);
	    InsaAdapter.requestStations('11.6289', '52.1308')
	    	.then(assertStations)
	    	.then(done)
	    	.fail(done);
	});

	it('requestJourneys', function (done) {
		this.timeout(3000);
	    InsaAdapter.requestJourneys(validExtIdOfStation)
	    	.then(assertJourneys)
	    	.then(done)
	    	.fail(done);
	});
});