'use strict';

var naics_2007 = require('naics-2007');
var naics_2012 = require('naics-2012');

exports.get = function (req, res, next) {
  var query = req.query;
  var year = query.year;
  var terms;
  var model;

  if (year) {
    if (year == '2007' || year == '2012') {
      model = year == '2007' ? naics_2007 : naics_2012;
      terms = query.terms;

      if (terms) {
        // Quickly look up NAICS codes by search terms.
        var results = model.search(terms);

        // Send JSON to client
        res.send(results);
        return next();
      } else {
        // No search terms provided
        return returnError(400, 'Please include search terms.');
      }
    } else if (year == '2002' || year == '1997') {
      return returnError(404, 'NAICS API does not currently include ' + year + ' data.');
    } else {
      return returnError(400, 'Please use a valid NAICS year.');
    }
  } else {
    return returnError(400, 'Please include a NAICS year.');
  }

  function returnError(http_status, error_msg) {
    // Generic error message function
    res.send(http_status, {
      'http_status': http_status,
      'error_msg': error_msg
    });
    return next(false); // Stop further processing
  }
};
