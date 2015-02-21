var InsaAdapter = require('./index');
var expect = require('chai').expect;
var _ = require('lodash');

describe('----Test insaAdapter----', function () {

	var validExtIdOfStation = '7393';

	var assertStations = function(responseBody) {
		expect(responseBody.stops).to.exist();
		expect(responseBody.stops).to.have.length.above(0, 'responseBody.stops');

		_.forEach(responseBody.stops, function(station) {
			expect(station.x).to.have.length.above(0, 'station.x');
			expect(station.y).to.have.length.above(0, 'station.y');
			expect(station.name).to.have.length.above(0, 'station.name');
			expect(station.urlname).to.have.length.above(0, 'station.urlname');
			expect(station.prodclass).to.have.length.above(0, 'station.prodclass');
			expect(station.extId).to.have.length.above(0, 'station.extId');
			expect(station.puic).to.have.length.above(0, 'station.puic');
			expect(station.dist).to.have.length.above(0, 'station.dist');
			expect(station.planId).to.have.length.above(0, 'station.planId');
		});
	};

	var assertJourneys = function(responseBody) {
		expect(responseBody.journey).to.exist();

		_.forEach(responseBody.journey, function(journey) {
			expect(journey.lfn).to.have.length.above(0, 'journey.lfn');
			expect(journey.id).to.have.length.above(0, 'journey.id');
			expect(journey.ti).to.have.length.above(0, 'journey.ti');
			expect(journey.da).to.have.length.above(0, 'journey.da');
			expect(journey.ic).to.have.length.above(0, 'journey.ic');
			expect(journey.pr).to.have.length.above(0, 'journey.pr');
			expect(journey.st).to.have.length.above(0, 'journey.st');
			expect(journey.tinfo).to.have.length.above(0, 'journey.tinfo');
			expect(journey.tinfoline).to.have.length.above(0, 'journey.tinfoline');
			expect(journey.rt).to.exist();
			if(journey.rt !== false) {
				expect(journey.rt.dlt).to.have.length.above(0, 'journey.rt.dlt');
				expect(journey.rt.dlm).to.have.length.above(0, 'journey.rt.dlm)');
				expect(journey.rt.status).to.have.length.above(0, 'journey.rt.status');
			} else {
				expect(journey.rt).to.be.false();
			}
		});
	};

	it('requestStations', function (done) {
		this.timeout(3000);
	    InsaAdapter.requestStations('11.633139', '52.120076')
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