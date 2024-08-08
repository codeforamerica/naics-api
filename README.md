# NAICS-API

[NAICS](http://www.census.gov/eos/www/naics/) (North American Industry Classification System) is maintained by the United States Bureau of Labor Statistics to classify business types. It is used for aggregating, presenting, and analyzing data and trends in the US economy.

The classification system is currently hosted by the [Census Bureau](http://www.census.gov/eos/www/naics/) and provided in various Excel and PDF documents, with some rudimentary HTML output and a not-so-great search tool.  Our goal is to improve on the Census Bureau's offerings by providing an API to make information machine-readable, with better search functionality, to assist with developing applications that depend on understanding or collecting information about businesses. 

## The Product

NAICS API is currently a Node.js server that returns NAICS data in a JSON format. Information stored on the server has been scraped or collected from files on the Census.gov web site. Most of the information for 2007 and 2012 has now been scraped thanks to the addition of a python scraper by Mike Migurski (see ``./data/scrape-examples-xrefs``).

### API documentation

[Latest API documentation is hosted at Apiary.io.](http://docs.naicsapi.apiary.io/)

### API example requests

Example request

    http://api.naics.us/v0/q?year=2012&code=519120


To get NAICS codes above a given code

    http://api.naics.us/v0/q?year=2012&code=519120&above=1


To get NAICS codes below a given code

    http://api.naics.us/v0/q?year=2012&code=51&below=1


To get all NAICS codes for a given years codes (only 2007 and 2012 are available right now)

    http://api.naics.us/v0/q?year=2012


To get all NAICS codes for given search terms (searches only title and index right now)

    http://api.naics.us/v0/s?year=2012&terms=libraries


__Warning!__ The URL (server and/or structure) is likely to change in the very near future. Do not use for production (yet).


### Usage

* A simple example demo search interface for NAICS codes [site](http://louh.github.io/naics-search) and [repository](https://github.com/louh/naics-search)

* Work in progress real-world application [site](http://lv-dof-staging.herokuapp.com/) and [repository](https://github.com/rclosner/lv-dof)


### Additional information

* An early NAICS scraper at [daguar/naics-scraper](https://github.com/daguar/naics-scraper/))
* Further discussion at [dobtco/NAICS](https://github.com/dobtco/NAICS/issues/1)
* Ongoing progress report at [codeforamerica/hack-requests](https://github.com/codeforamerica/hack-requests/blob/master/naics-api.md)


## Development setup (on Mac OS X 10.8)

### First-time setup

1) Download and install [Node.js](http://nodejs.org/).

2) Clone this repository to a folder on your computer. The rest of this document will refer to this folder as `$PROJECT_ROOT`.

3) Install project dependencies.

    cd $PROJECT_ROOT
    yarn install

### Every time you sync $PROJECT_ROOT with the remote GitHub repo

1) Update the project dependencies.

    cd $PROJECT_ROOT
    yarn upgrade-interactive

_Note: if this doesn't work you may need to run the following_:
`yarn plugin import interactive-tools`

### To start the REST API server

1) Start the REST API server.

    cd $PROJECT_ROOT
    yarn start

## Contributing

### Help Needed

There are other data that can be included in the API. Not all of these are within the scope of the scraper however.

* Illustrative examples from 2007 NAICS
* Information from NAICS prior to 2007 (2002, 1997 - low priority)
* Data for converting between different NAICS codes and other systems, like SIC or NIGP

On the API side:

* The API should perform searches on all the available data and return relevant results from the requester (e.g. a business type lookup application)
* Close [existing issues][issues].

### Submitting an Issue
We use the [GitHub issue tracker][issues] to track bugs and features. Before submitting a bug report or feature request, check to make sure it hasn't already been submitted. When submitting a bug report, please include a [Gist][] that includes a stack trace and any details that may be necessary to reproduce the bug, including your gem version, Ruby version, and operating system. Ideally, a bug report should include a pull request with failing specs.

[gist]: https://gist.github.com/
[issues]: https://github.com/codeforamerica/naics-api/issues?&state=open

### Submitting a Pull Request
1. [Fork the repository.][fork]
2. [Create a topic branch.][branch]
3. Add specs for your unimplemented feature or bug fix.
4. Implement your feature or bug fix.
5. Add, commit, and push your changes.
6. [Submit a pull request.][pr]

[fork]: http://help.github.com/fork-a-repo/
[branch]: http://learn.github.com/p/branching.html
[pr]: http://help.github.com/send-pull-requests/


[![Code for America Tracker](http://stats.codeforamerica.org/codeforamerica/cfa_template.png)](http://stats.codeforamerica.org/projects/naics-api)