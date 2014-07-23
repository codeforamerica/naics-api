'use strict';

require("coffee-script/register");
var model = require('./model');

/**
 * Get awesome things
 */
 exports.awesomeThings = function(req, res) {
  res.json([
  {
    name : 'HTML5 Boilerplate',
    info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
    awesomeness: 10
  }, {
    name : 'AngularJS',
    info : 'AngularJS is a toolset for building the framework most suited to your application development.',
    awesomeness: 10
  }, {
    name : 'Karma',
    info : 'Spectacular Test Runner for JavaScript.',
    awesomeness: 10
  }, {
    name : 'Express',
    info : 'Flexible and minimalist web application framework for node.js.',
    awesomeness: 10
  }
  ]);
};

exports.q = function(req, res) {

  var query = req.query,
  year,
  code,
  results,
  all_codes,
  i;

  var year = query.year;

  if(!year){
    returnError(400, 'Please include a NAICS year.');
    return;
  }      

  if (year == '2002' || year == '1997') {
    returnError(404, 'NAICS API does not currently include ' + year + ' data.');
    return;
  }

  if (year == '2007' || year == '2012') {
      try {
        model.sendResultsFromDb(query, sendResults, returnError);
      } catch(e) {
        returnError(400, e);
        return;
      }
    }
  else {
    returnError(400, 'Please use a valid NAICS year.');
    return;
    }

  function returnError (http_status, error_msg) {
    // Generic error message function
    res.send(http_status, {
      'status': http_status,
      'message': error_msg,
      'code': '',
      'more_info': ''
    });
  }

  function sendResults (raw_results) {
    res.json(raw_results);
  }
  
};
