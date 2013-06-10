
var naics_2007          = require(process.cwd() + '/data/naics-2007'),
    naics_2012          = require(process.cwd() + '/data/naics-2012'),
    naics_2007_index    = require(process.cwd() + '/data/naics-2007-index'),
    naics_2012_index    = require(process.cwd() + '/data/naics-2012-index'),
    naics_2012_desc     = require(process.cwd() + '/data/naics-2012-desc')

exports.get = function ( req, res ) {
    var query = req.query
    var naics_year,
        naics_code,
        naics_index,
        naics_desc,
        above,
        below,
        item

    if (query.year) {
        if (query.year == '2007' || query.year == '2012') {

            if (query.year == '2007') { naics_year = naics_2007; naics_index = naics_2007_index }
            if (query.year == '2012') { naics_year = naics_2012; naics_index = naics_2012_index; naics_desc = naics_2012_desc }

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
                // return full year
                var naics_full = []
                var the_item

                // add other information
                for (var i = 0; i < naics_year.items.length; i++) {
                    the_item = getCode(naics_year, naics_year.items[i].code)

                    if (query.collapse == '1') {
                        if (the_item.description) {
                            if (the_item.description.substring(0, 28) == 'See industry description for') continue;                            
                        }
                        if (the_item.description == null) continue;
                    }

                    naics_full[naics_full.length] = getCode(naics_year, naics_year.items[i].code)
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

                assembleCode(year.items[i], code)

                return year.items[i]
            }
        }
    }

    function assembleCode (item, code) {
        // Add index and description to given code

        if (naics_desc) {
            item.description = naics_desc[code]
        }
        if (naics_index) {
            item.index = naics_index[code]
        }

        return item
    }

    function getAboveCode (year, code) {
        // Given a NAICS code, returns an array of all NAICS codes above it on the hierarchy.
        // Returns an empty object or an object with null if there is nothing found
        // If the top level (2-digit) NAICS code is a range (e.g. 31-33), this is broken. It returns a null item instead of the NAICS data.

        var collection = []

        for (var i = 2; i < code.length; i++) {
            collection[collection.length] = getCode(year, code.substr(0, i))
        }
        return collection;
    }

    function getBelowCode (year, code) {
        // Given a NAICS code, returns an array of all NAICS codes below it on the hierarchy.
        // Returns an empty object or an object with null if there is nothing found
        // If the top level (2-digit) NAICS code is a range (e.g. 31-33), this is broken.
        // However if you try to get codes using just the two-digit range (e.g. '31' instead, or '32' it will sort of work.)

        var collection = []
 
        for (var i = 0; i < year.items.length; i++) {
            if (year.items[i].code.toString().substr(0, code.length) == code && year.items[i].code != code) {
                collection[collection.length] = assembleCode(year.items[i], year.items[i].code)
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
        // if &limit < 1 or null, assume no limit.
        // if &page=0 or null, assume page 1. this function should also add a page number to the result json
        // would it be possible / necessary to use negative page numbers to indicate counting from the back of the results?
        // note: specifying a page number is useless unless limit is also specified.

        var isInt = /^\d+$/
        var limit = query.limit
        var page = query.page

        if (limit > 0 && isInt.test(limit)) {
            if (page < 1 || isInt.test(page) == false) {
                page = 1
            }

            var lower = limit * (page - 1)
            var upper = limit * page

            input = input.slice(lower, upper)
        }

        return input
    }

}

