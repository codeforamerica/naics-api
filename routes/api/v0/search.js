
var naics_2007 = require(process.cwd() + '/data/naics-2007')
var naics_2012 = require(process.cwd() + '/data/naics-2012')
var naics_year;

exports.get = function ( req, res ) {
    var query = req.query;

    if (query.year) {
        if (query.year == '2007' || query.year == '2012') {

            if (query.year == '2007') { naics_year = naics_2007 }
            if (query.year == '2012') { naics_year = naics_2012 }

            if (query.code) {
                item = getCode(naics_year, query.code)
                if (item) {
                    res.send(item)
                }
                else {
                    returnError(res, '404', 'This is not a valid NAICS code.')
                }
            }
            else {
                res.send(naics_year);
            }
        }
        if (query.year == '2002' || query.year == '1997') {
            returnError(res, '404', 'NAICS API does not currently include ' + query.year + ' data. If this is important to you, please let us know.')
        }
        else {
            returnError(res, '400', 'Please use a valid NAICS year.')
        }
    }
    else {
        returnError(res, '400', 'Please include a NAICS year.')
    }
}

function getCode (year, code) {
    for (var i = 0; i < year.items.length; i++) {
        if (year.items[i].code == code) {
            return year.items[i]
        }
    }
}

function returnError (res, error_code, error_msg) {
    res.send(error_code, {
        'error_code': error_code,
        'error_msg': error_msg
    })
}