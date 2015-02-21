var request = require('request');
var async = require('async');
var _ = require('lodash');
var InsaAdapter = require('../../adapters/insaAdapter');


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
    if(_.isNull(journey.st) || journey.st === '' || _.isNull(journey.pr) || journey.pr === '' || _.isNull(journey.da) || journey.da === '') return;
    if(!_.isNull(journey.rt.dlt)) journey.da = journey.rt.dlt;
    var date;
    if(_.includes(journey.da, '.')){
          date = journey.da.split('.').reverse();
          date[0] = '20' + date[0];
    } else {
      date = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()];
    }
    var timeTableEntry = {};
        timeTableEntry.line = journey.pr.replace(/\s+/g, ' ');
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

//TODO refactor for better promiseArray handling. Can we wait for promiseArray to resolve but then return timeTables instead?
var createTimeTables = function(timeTables) {
  return function(stationData) {
    var promiseArray = [];

    _.forEach(stationData.stops, function(station) {
      if(station.prodclass <= 31){
        return;
      }
      var timeTable = {};
      timeTable.station_info = getFormattedStationName(station.name);
      var journeyPromise = getJourneys(station);
      journeyPromise.then(function(val) {
        timeTable.departure_times = val;
      });
      promiseArray.push(journeyPromise);
      timeTables.push(timeTable);
    });

    return promiseArray;
  };
};

//TODO is hack. make frontend more robust so we dont have to clean timetable
var cleanTimetable = function(timeTables) {
  return function() {
    if(timeTables.length > 0 && _.isUndefined(timeTables[0].departure_times)) timeTables = [];
    return timeTables;
  };
};


var getTimeTables = function(longitude, latitude) {
  var timeTables = [];
  return  InsaAdapter.requestStations(longitude, latitude)
          .then(createTimeTables(timeTables)).all()
          .then(cleanTimetable(timeTables))
          .fail(console.warn);
};


module.exports = {
  getTimeTables: getTimeTables
};