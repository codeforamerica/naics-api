'use strict'

var naics_2007 = require('naics-2007'),
    naics_2012 = require('naics-2012');

exports.get = function ( req, res ) {
	var query = req.query,
      year,
      terms,
      model;

  year = query.year;

	if (year) {
		if (year == '2007' || year == '2012') {

			if (year == '2007') { model = naics_2007 }
			if (year == '2012') { model = naics_2012 }

      var terms = query.terms;

			if (terms) {
			
			    // Quickly look up NAICS codes by search terms.
			    var results = model.search(terms);

			    // Send JSON to client
			    res.send(results);

			}
			else {
				// no search terms provided
				returnError(400, 'Please include search terms.')
			}
		}
		if (year == '2002' || year == '1997') {
			returnError(404, 'NAICS API does not currently include ' + year + ' data.')
		}
		else {
			returnError(400, 'Please use a valid NAICS year.')
		}
	}
	else {
		returnError(400, 'Please include a NAICS year.')
	}

	function returnError (http_status, error_msg) {
		// Generic error message function
		res.send(http_status, {
			'http_status': http_status,
			'error_msg': error_msg
		})
	}

}
