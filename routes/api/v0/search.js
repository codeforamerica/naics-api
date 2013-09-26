'use strict'

var codes_2007          = require(process.cwd() + '/data/codes-2007'),
	codes_2012          = require(process.cwd() + '/data/codes-2012'),
	index_2007          = require(process.cwd() + '/data/index-2007'),
	index_2012          = require(process.cwd() + '/data/index-2012')

exports.get = function ( req, res ) {
	var query = req.query
	var codes_year,
		index_year,
		naics_desc

	if (query.year) {
		if (query.year == '2007' || query.year == '2012') {

			if (query.year == '2007') { codes_year = codes_2007; index_year = index_2007 }
			if (query.year == '2012') { codes_year = codes_2012; index_year = index_2012 }

			if (query.terms) {
			
			    // Quickly look up NAICS codes by search terms.
			    var results = index_year[query.terms.toLowerCase()];
			    
			    // Build array of matching NAICS items.
			    var items = [];
			    
			    for(var code in results)
			    {
			        items.push(codes_year[code])
			    }
			    
			    // Sort with highest-scored items first.
			    items.sort(function(a, b) { return (results[b.code] - b.code.toString().length*2) - (results[a.code] - a.code.toString().length*2) });
			
			    // Send JSON to client
			    res.send(items);

			}
			else {
				// no search terms provided
				returnError(400, 'Please include search terms.')
			}
		}
		if (query.year == '2002' || query.year == '1997') {
			returnError(404, 'NAICS API does not currently include ' + query.year + ' data.')
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

