[![Build Status](https://travis-ci.org/18F/codetalker.svg?branch=master)](https://travis-ci.org/18F/codetalker)

# Code Talker

## The Product
Code Talker is a set of API endpoints to enable discovery and understanding of various procurement codes. The API is intented to power sites and applications that utilize federal solicitations and support industry and government interactions.

Code Talker 's NAICS endpoints return NAICS data in JSON format. Information stored on the server has been scraped or collected from files on the Census.gov web site. Most of the information for 2007 and 2012 has now been scraped thanks to the addition of a python scraper by Mike Migurski (see ``./data/scrape-examples-xrefs``).

## NAICS
[NAICS](http://www.census.gov/eos/www/naics/) (North American Industry Classification System) is maintained by the United States Bureau of Labor Statistics to classify business types. The classification system is currently hosted by the [Census Bureau](http://www.census.gov/eos/www/naics/) and provided in various Excel and PDF documents.  Our goal is to improve on the Census Bureau's offerings by providing an API to make information machine-readable, with better search functionality, to assist with developing applications that depend on understanding or collecting information about businesses.

## Installation as a local server

### Installation with Vagrant

Vagrant is a tool letting you easily set up a virtual machine with all requirements
for `codetalker` pre-installed.

First install the lastest Vagrant () and Virtualbox (4.3.12+). Then run the below in the console.

```
vagrant plugin install vagrant-vbguest
vagrant up
vagrant ssh
```

### (Alternately) Installation without Vagrant


1) Download and install [Node.js](http://nodejs.org/) and [Ruby](rubylang.org).

2)

    sudo npm install -g grunt-cli bower
    sudo gem install compass

## Setup

After installation of the software,

1) Clone this repository to a folder on your computer. The rest of this document will refer to this folder as `$PROJECT_ROOT`.

    export PROJECT_ROOT=`pwd`/codetalker
    git clone https://github.com/18F/codetalker.git $PROJECT_ROOT

2) Install project-specific dependencies.

    cd $PROJECT_ROOT
    nodenv rehash
    bower install
    npm install

### Every time you sync $PROJECT_ROOT with the remote GitHub repo

1) Update the project dependencies.

    cd $PROJECT_ROOT
    npm install

### To start the REST API server

1) Start the REST API server.

    cd $PROJECT_ROOT
    npm start

## API documentation

[Latest API documentation is hosted at Apiary.io.](http://docs.codetalker.apiary.io/)

### API example requests

(To run these examples against your local development server, replace
`http://api.data.gov/gsa/naics/` with `http://localhost:9000/api/`)

Example request

    http://api.data.gov/gsa/naics/q?year=2012&code=519120


To get NAICS codes above a given code

    http://api.data.gov/gsa/naics/q?year=2012&code=519120&above=1


To get NAICS codes below a given code

    http://api.data.gov/gsa/naics/q?year=2012&code=51&below=1


To get all NAICS codes for a given years codes (only 2007 and 2012 are available right now)

    http://api.data.gov/gsa/naics/?year=2012

To get only a partial set of fields in the response

    http://api.data.gov/gsa/naics/?year=2012&field=code&field=title

To get all NAICS codes for given search terms (searches only title and index right now)

    http://api.naics.us/v0/s?year=2012&terms=libraries


### Usage

* A simple example demo search interface for NAICS codes [site](http://louh.github.io/naics-search) and [repository](https://github.com/louh/naics-search)

* Work in progress real-world application [site](http://lv-dof-staging.herokuapp.com/) and [repository](https://github.com/rclosner/lv-dof)

## Contributing

### Help Needed

There are other data that can be included in the API. Not all of these are within the scope of the scraper however.

* Information from NAICS prior to 2007 (2002, 1997 - low priority)
* Data for converting between different NAICS codes and other systems, like SIC or NIGP

On the API side:

* The API should perform searches on all the available data and return relevant results from the requester (e.g. a business type lookup application)
* Close [existing issues][issues].

### Submitting an Issue
We use the [GitHub issue tracker][issues] to track bugs and features. Before submitting a bug report or feature request, check to make sure it hasn't already been submitted. When submitting a bug report, please include a [Gist][] that includes a stack trace and any details that may be necessary to reproduce the bug, including your gem version, Ruby version, and operating system. Ideally, a bug report should include a pull request with failing specs.

[gist]: https://gist.github.com/
[issues]: https://github.com/18F/afsmallbiz/issues?state=open

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


### Public domain

All work on this project (by 18F, and contributors to 18F), since its forking from Code for America, is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

See [LICENSE.md](LICENSE.md) for more details on pre-fork and post-fork licensing.
