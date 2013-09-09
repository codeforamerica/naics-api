'use strict'

var naics_2007          = require(process.cwd() + '/data/naics-2007'),
	naics_2012          = require(process.cwd() + '/data/naics-2012')

exports.get = function ( req, res ) {
	var query = req.query
	var naics_year,
		naics_code,
		naics_desc,
		above,
		below,
		item

	if (query.year) {
		if (query.year == '2007' || query.year == '2012') {

			if (query.year == '2007') { naics_year = naics_2007 }
			if (query.year == '2012') { naics_year = naics_2012 }

			naics_code = query.code

			if (naics_code) {
				
				// Get a single code entry
				item = getCode(naics_year, naics_code)

				// If user wants NAICS codes above or below it on the hierarchy.
				if (query.above == 1) {
					above = getAboveCode(naics_year, naics_code)
					sendResults(above)
				}

				if (query.below == 1) {
					below = getBelowCode(naics_year, naics_code)
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
				for (var i = 0; i < naics_year.items.length; i++) {
					the_item = naics_year.items[i]

					// If part_of_range exists, skip it from inclusion
					if (the_item.part_of_range) continue

					// Collapse: Undocumented and experimental feature to include only codes that are not blanks or referrals to other codes.
					if (query.collapse == '1') {
						if (the_item.description_code) continue 
						if (the_item.description == null) continue
					}

					// TitlesOnly: Undocumented and experimental feature to remove things so only title and code are returned (keeps things like navigation loading simpler)
					if (query.titlesonly == '1') {

						// Clone the original
						the_item = JSON.parse(JSON.stringify(naics_year.items[i]))

						var toDelete = ['description', 'description_code', 'crossrefs', 'examples', 'trilateral', 'change_indicator', 'seq_no', 'index']
						for (var key in toDelete) {
							var x = toDelete[key]
							if (the_item[x]) delete the_item[x]
						}
					}

					naics_full.push(the_item)
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
		// Returns information for a given NAICS code
		for (var i = 0; i < year.items.length; i++) {
			if (year.items[i].code == code) {

				// if code is in a range, get the actual ranged code
				if (year.items[i].part_of_range) {
					return getCode(year, year.items[i].part_of_range)
				}

				return year.items[i]
			}
		}
	}

	function getAboveCode (year, code) {
		// Given a NAICS code, returns an array of all NAICS codes above it on the hierarchy.
		// Returns an empty object or an object with null if there is nothing found
		var collection = []

		for (var i = 2; i < code.length; i++) {
			collection.push(getCode(year, code.substr(0, i)))
		}
		return collection;
	}

	function getBelowCode (year, code) {
		// Given a NAICS code, returns an array of all NAICS codes below it on the hierarchy.
		// Returns an empty object or an object with null if there is nothing found
		var collection = []
		for (var i = 0; i < year.items.length; i++) {
			if (year.items[i].code.toString().substr(0, code.length) == code && year.items[i].code != code) {

				// A hacky way of NOT including the top level ranged code if it is one
				if (year.items[i].code.toString().substr(2,1) == '-') continue

				collection.push(year.items[i])
			}
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

