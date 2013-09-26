'use strict'

var codes_2007 = require(process.cwd() + '/data/codes-2007'),
	  codes_2012 = require(process.cwd() + '/data/codes-2012');

exports.get = function ( req, res ) {
	var query = req.query
	var codes_year,
		naics_code,
		naics_desc,
		above,
		below,
		item

	if (query.year) {
		if (query.year == '2007' || query.year == '2012') {

			if (query.year == '2007') { codes_year = codes_2007 }
			if (query.year == '2012') { codes_year = codes_2012 }

			naics_code = query.code

			if (naics_code) {
				
				// Get a single code entry
				item = getCode(codes_year, naics_code)

				// If user wants NAICS codes above or below it on the hierarchy.
				if (query.above == 1) {
					above = getAboveCode(codes_year, naics_code)
					sendResults(above)
				}

				if (query.below == 1) {
					below = getBelowCode(codes_year, naics_code)
					sendResults(below)
				}

				// Send to user
				if (item) {
					res.send(item)
				}
				else {
					returnError(404, 'This is not a valid NAICS code.')
				}
			}
			else {
				// Return full year
				var naics_full = []
				var the_item

				// Some processing
        var codes = Object.keys(codes_year);
        for (var i = 0; i < codes.length; i++) {
          var code = codes[i];
          var item = codes_year[code];

					// If part_of_range exists, skip it from inclusion
          if (item.part_of_range) continue;

          // Collapse: Undocumented and experimental feature to include only codes that are not blanks or referrals to other codes.
					if (query.collapse == '1') {
						if (item.description_code) continue 
						if (item.description == null) continue
					}

          // TitlesOnly: Undocumented and experimental feature to remove things so only title and code are returned (keeps things like navigation loading simpler)
					if (query.titlesonly == '1') {
						// Clone the original
            item = { title: item.title }
					}

          naics_full.push(item);
        }

				sendResults(naics_full);
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

	function getCode (year, code) {
    return year[code];
	}

	function getAboveCode (year, code) {
		// Given a NAICS code, returns an array of all NAICS codes above it on the hierarchy.
		// Returns an empty object or an object with null if there is nothing found
		var collection = [];
    var codes = Object.keys(year);

    for (var i = codes.length; i > 0; i--) {
      var c = year[code.substr(0, code.length - i)];
      if (c !== undefined) collection.push(c);
    }

		return collection;
	}

	function getBelowCode (year, code) {
		// Given a NAICS code, returns an array of all NAICS codes below it on the hierarchy.
		// Returns an empty object or an object with null if there is nothing found
		var collection = []
    var codes = Object.keys(year);

    for (var i = 0; i < codes.length; i++) {
      var c = codes[i];
      if (c.length > code.length && c.substr(0, code.length) == code) collection.push(year[c]);
    }

    return collection;
  }

	function returnError (http_status, error_msg) {
		// Generic error message function
		res.send(http_status, {
			'http_status': http_status,
			'error_msg': error_msg
		})
	}

	function sendResults (results) {
		// paginate and send results

		if (query.limit || query.page) {
			results = paginate(results)
		}

		res.send(results)
	}

	function paginate (input) {
		// use &limit and &page to determine paged results

		var isInt = /^\d+$/
		var limit = query.limit
		var page = query.page

		if (isInt.test(limit)) {

			var lower = limit * (page - 1)
			var upper = limit * page

			input = input.slice(lower, upper)
		}

		return input
	}

}

