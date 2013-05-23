# naics-api

Basic API to return [NAICS codes](http://www.census.gov/eos/www/naics/) and descriptive information (to-do)

Example request

    http://naics-api.herokuapp.com/v0/q?year=2012&code=519120


To get NAICS codes above a given code

    http://naics-api.herokuapp.com/v0/q?year=2012&code=519120&above=1


To get NAICS codes below a given code

    http://naics-api.herokuapp.com/v0/q?year=2012&code=51&below=1


To get all NAICS codes for a given years codes (only 2007 and 2012 are available right now)

    http://naics-api.herokuapp.com/v0/q?year=2012


__Warning!__ The URL (server and/or structure) is likely to change in the very near future. Do not use for production (yet).



## Development setup (on Mac OS X 10.8)

### First-time setup

1) Download and install [Node.js](http://nodejs.org/).

2) Clone this repository to a folder on your computer. The rest of this document will refer to this folder as `$PROJECT_ROOT`.

3) Install project dependencies.

    cd $PROJECT_ROOT
    npm install

### Every time you sync $PROJECT_ROOT with the remote GitHub repo

1) Update the project dependencies.

    cd $PROJECT_ROOT
    npm install

### To start the REST API server

1) Start the REST API server.

    cd $PROJECT_ROOT
    node server.js

