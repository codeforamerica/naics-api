
var naics_2007 = require(process.cwd() + "/data/naics-2007")
var naics_2012 = require(process.cwd() + "/data/naics-2012")
var naics;
 
exports.get = function ( req, res ) {
    var query = req.query;

    if (query.year) {
        if (query.year == "2007") {
            if (query.code) {
                getCode(res, query.code, naics_2007)
            }
            else {
                res.send(naics_2007)
            }
        }
        if (query.year == "2012") {
            if (query.code) {
                getCode(res, query.code, naics_2012)
            }
            else {
                res.send(naics_2012)
            }
        }
        res.send(400, 'Nothing found.')
    }
}

function getCode (res, code, year) {
    for (var i = 0; i < year.items.length; i++) {
        item = year.items[i];
        if (item.code == code) {
            res.send(year.items[i])
        }
    }
}