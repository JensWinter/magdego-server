var InsaAdapter = require('./index');
var expect = require('chai').expect;
var _ = require('lodash');

describe('----Test insaAdapter----', function () {

	var validExtIdOfStation = '7393';

	var assertStations = function(responseBody) {
		expect(responseBody.stops).to.exist();
		expect(responseBody.stops).to.have.length.above(0);
		//NEED MEANINGFUL TESTS!!
	};

	var assertJourneys = function(responseBody) {
		expect(responseBody.journey).to.exist();
		//NEED MEANINGFUL TESTS!!
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