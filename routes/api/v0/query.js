
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
                    res.send(above)
                }

                if (query.below == 1) {
                    below = getBelowCode(naics_year, naics_code)
                    res.send(below)
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

                // add index
                for (var i = 0; i < naics_year.items.length; i++) {
                    if (naics_desc) {
                        naics_year.items[i]['description'] = naics_desc[naics_year.items[i].code]
                    }
                    naics_year.items[i]['index'] = naics_index[naics_year.items[i].code]
                }

                res.send(naics_year);
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
                if (naics_desc) {
                    year.items[i]['description'] = naics_desc[code]
                }
                year.items[i]['index'] = naics_index[code]
                return year.items[i]
            }
        }
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
                if (naics_desc) {
                    naics_year.items[i]['description'] = naics_desc[naics_year.items[i].code]
                }
                year.items[i]['index'] = naics_index[year.items[i].code]
                collection[collection.length] = year.items[i]
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

}

