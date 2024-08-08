'use strict';

var naics_2007 = require('naics-2007');
var naics_2012 = require('naics-2012');

exports.get = function (req, res, next) {
  var query = req.query;
  var model;
  var year = query.year;
  var code;

  if (year) {
    if (year == '2007' || year == '2012') {
      model = year == '2007' ? naics_2007 : naics_2012;
      code = query.code;

      if (code) {
        // Get a single code entry
        var item = getCode(model, code);

        if (query.above == 1) {
          var above = getAboveCode(model, code);
          return sendResults(above);
        }

        if (query.below == 1) {
          var below = getBelowCode(model, code);
          return sendResults(below);
        }

        // Send to user
        if (item) {
          return res.send(item);
        } else {
          return returnError(404, 'This is not a valid NAICS code.');
        }
      } else {
        // Return full year
        var results = [];
        var codes = model.all();

        for (var i = 0; i < codes.length; i++) {
          var item = codes[i];

          // If part_of_range exists, skip it from inclusion
          if (item.part_of_range) continue;

          // Collapse: Undocumented and experimental feature to include only codes that are not blanks or referrals to other codes.
          if (query.collapse == '1') {
            if (item.description_code) continue;
            if (item.description == null) continue;
          }

          // TitlesOnly: Undocumented and experimental feature to remove things so only title and code are returned (keeps things like navigation loading simpler)
          if (query.titlesonly == '1') {
            // Clone the original
            item = { title: item.title };
          }

          results.push(item);
        }

        return sendResults(results);
      }
    } else if (year == '2002' || year == '1997') {
      return returnError(404, 'NAICS API does not currently include ' + year + ' data.');
    } else {
      return returnError(400, 'Please use a valid NAICS year.');
    }
  } else {
    return returnError(400, 'Please include a NAICS year.');
  }

  function getCode(model, code) {
    return model.find(code);
  }

  function getAboveCode(model, code) {
    return model.above(code);
  }

  function getBelowCode(model, code) {
    return model.below(code);
  }

  function returnError(http_status, error_msg) {
    // Generic error message function
    res.send(http_status, {
      'http_status': http_status,
      'error_msg': error_msg
    });
    return next(false); // Stop further processing
  }

  function sendResults(results) {
    // Paginate and send results
    if (query.limit || query.page) {
      results = paginate(results);
    }

    res.send(results);
    return next(); // Continue to the next middleware
  }

  function paginate(input) {
    // Use &limit and &page to determine paged results
    var isInt = /^\d+$/;
    var limit = query.limit;
    var page = query.page;

    if (isInt.test(limit) && isInt.test(page)) {
      var lower = limit * (page - 1);
      var upper = limit * page;
      input = input.slice(lower, upper);
    }

    return input;
  }
};
