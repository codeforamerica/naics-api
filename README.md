naics-api
=========

Basic API to return [NAICS codes](http://www.census.gov/eos/www/naics/) and information

Example request

    http://naics-api.herokuapp.com/v0/q?year=2012&code=446199


To get NAICS codes above a given code

    http://naics-api.herokuapp.com/v0/q?year=2012&code=446199&above=1


To get NAICS codes below a given code

    http://naics-api.herokuapp.com/v0/q?year=2012&code=44&below=1



Note: The URL structure is likely to change in the very near future. Do not use for production (yet).