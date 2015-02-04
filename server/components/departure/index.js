var request = require('request');
var async = require('async');
var _ = require('lodash');
var InsaAdapter = require('../../adapters/insaAdapter');


var timeTables;


//station names have format 'City, Station'. We only need Station.
var getFormattedStationName = function(stationName) {
  var indexKomma = stationName.indexOf(',');
  if(indexKomma === -1) indexKomma = -2;
  var sliced = stationName.slice(indexKomma + 2, stationName.length);
  return sliced;
};


//TODO refactor
var retrieveJourneyInformation = function(res) {
  if( !res.hasOwnProperty('journey') ) {
    return;
  }

  var timeTable = [];

  _.forEach(res.journey, function(journey) {
    if(_.isNull(journey.st) || _.isNull(journey.pr) || _.isNull(journey.da)) return;
    if(!_.isNull(journey.rt.dlt)) journey.da = journey.rt.dlt;
    var date;
    if(_.includes(journey.da, '.')){
          date = journey.da.split('.').reverse();
          date[0] = '20' + date[0];
    } else {
      date = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()];
    }
    var timeTableEntry = {};
        timeTableEntry.line = journey.pr;
        timeTableEntry.departure = new Date(date + ' ' + journey.ti).toJSON();
        timeTableEntry.direction = getFormattedStationName(journey.st);

    if(journey.rt !== false) timeTableEntry.delay = {};
    if(!_.isUndefined(journey.rt.dlm)) timeTableEntry.delay.minutes = journey.rt.dlm; 
    if(!_.isUndefined(journey.rt.status)) timeTableEntry.delay.status = journey.rt.status; 
    timeTable.push(timeTableEntry);
  });
  return timeTable;

};


var getJourneys = function(station) {
  return  InsaAdapter.requestJourneys(station.extId)
          .then(retrieveJourneyInformation);
};


var createTimeTables = function(stationData) {
  var promiseArray = [];
  timeTables = _.map(stationData.stops, function(station) {
    var timeTable = {};
    timeTable.station_info = getFormattedStationName(station.name);
    var journeyPromise = getJourneys(station);
    journeyPromise.then(function(val) {
      timeTable.departure_times = val;
    });
    promiseArray.push(journeyPromise);
    return timeTable;
  });

  return promiseArray;
};


//TODO is hack. make frontend more robust so we dont have to clean timetable
var cleanTimetable = function() {
  if(_.isUndefined(timeTables[0].departure_times)) timeTables = [];
  return timeTables;
};


var getTimetables = function(longitude, latitude) {
  return  InsaAdapter.requestStations(longitude, latitude)
          .then(createTimeTables).all()
          .then(cleanTimetable)
          .fail(console.warn);
};


module.exports = {
  getTimetables: getTimetables
};