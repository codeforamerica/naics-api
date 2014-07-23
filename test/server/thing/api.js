'use strict';
var _ = require('lodash');

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest');

describe('Querying NAICS by year', function() {
  this.timeout(5000);
  
  it('should respond with JSON array when given a valid year', function(done) {
    request(app)
      .get('/api/q?year=2012')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.results.should.be.instanceof(Array);
      });

      request(app)
      .get('/api/q?year=2007')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.results.should.be.instanceof(Array);
        done();
      });
  });

  it('should require a year parameter', function(done) {
    request(app)
      .get('/api/q')
      .expect(400)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('message', 'Please include a NAICS year.');
        res.body.should.have.property('status', 400);
        done();
      });
  });

  it('should reject an invalid NAICS year', function(done) {
    request(app)
      .get('/api/q?year=2099')
      .expect(400)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('message', 'Please use a valid NAICS year.');
        res.body.should.have.property('status', 400); 
        done();
      });
  });

  it("should generate an error if year parameter is valid but we don't have data for it", function(done) {
    request(app)
      .get('/api/q?year=2002')
      .expect(404)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('message', 'NAICS API does not currently include 2002 data.');
        res.body.should.have.property('status', 404);
      });

      request(app)
      .get('/api/q?year=1997')
      .expect(404)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('message', 'NAICS API does not currently include 1997 data.');
        res.body.should.have.property('status', 404);
        done();
      });
  });

  it('should apply a limit of 25 records if no limit is specified', function (done) {
      request(app)
      .get('/api/q?year=2007')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.results.should.have.property('length', 25); 
        done();
      });
  });

  it('should apply a limit of 50 records even if limit set higher', function (done) {
      request(app)
      .get('/api/q?year=2007&limit=100')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.results.should.have.property('length', 50); 
        done();
      });
  });

    it('should return 10 results when limit 10', function (done) {
      request(app)
      .get('/api/q?year=2012&limit=10')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.results.should.have.property('length', 10); 
        done();
      });
  });

   it('should return all fields if `field` argument absent', function (done) {
      request(app)
      .get('/api/q?year=2012&limit=1')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        (res.body.results[0]).should.have.property('code'); 
        (res.body.results[0]).should.have.property('title'); 
        (res.body.results[0]).should.have.property('description');
        done();
      });
  });
   
   it('should only return single requested field', function (done) {
      request(app)
      .get('/api/q?year=2012&limit=2&field=title')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        (res.body.results[0]).should.have.property('title'); 
        (res.body.results[0]).should.not.have.property('description');
        (res.body.results[0]).should.not.have.property('seq_no');
        (res.body.results[0]).should.not.have.property('code');
        (res.body.results[1]).should.have.property('title'); 
        (res.body.results[1]).should.not.have.property('description'); 
        (res.body.results[1]).should.not.have.property('seq_no');
        (res.body.results[1]).should.not.have.property('code');
        done();
      });
  });
   
  it('should recognize field names case-insensitively', function (done) {
      request(app)
      .get('/api/q?year=2012&limit=2&field=tItLe')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        (res.body.results[0]).should.have.property('title'); 
        (res.body.results[0]).should.not.have.property('description');
        (res.body.results[0]).should.not.have.property('seq_no');
        (res.body.results[0]).should.not.have.property('code');
        (res.body.results[1]).should.have.property('title'); 
        (res.body.results[1]).should.not.have.property('description'); 
        (res.body.results[1]).should.not.have.property('seq_no');
        (res.body.results[1]).should.not.have.property('code');
        done();
      });
  });

   it('should only return multiple requested fields', function (done) {
      request(app)
      .get('/api/q?year=2012&field=code&limit=1&field=title')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        (res.body.results[0]).should.have.property('title'); 
        (res.body.results[0]).should.not.have.property('description');
        (res.body.results[0]).should.not.have.property('seq_no');
        (res.body.results[0]).should.have.property('code');
        done();
      });
  });
   
  it('should throw error if only nonexistent fields specified', function(done) {
    request(app)
      .get('/api/q?year=2012&field=foo')
      .expect(400)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('message', 'Only fields code,year,title,description,crossrefs accepted');
        res.body.should.have.property('status', 400); 
        done();
      });
  });

  it('should offset result set by number of pages specified', function(done) {
      // we'll query a 10-record page 1, then a 5-record page 2;
      // the page 2 records should be the same as the last 5 from page 1
      var first_results;
      request(app)
      .get('/api/q?year=2012&limit=10&field=code&page=1')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        first_results = res.body.results;
        request(app)
        .get('/api/q?year=2012&limit=5&field=code&page=2')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.results.should.have.property('length', 5);
          (_.isEqual(res.body.results[0], first_results[5])).should.be.true;
          (_.isEqual(res.body.results[1], first_results[6])).should.be.true;
          done();
        });
      });
  });
   

  it('should offset result set by number of records set by start parameter', function(done) {
      // we'll query 5 records, then again with start=3;
      // the first row returned from the second query should match the third of the first query
      var first_results;
      request(app)
      .get('/api/q?year=2012&limit=5&field=code')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        first_results = res.body.results;
        request(app)
        .get('/api/q?year=2012&limit=5&field=code&start=3')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          (_.isEqual(res.body.results[0], first_results[2])).should.be.true;
          (_.isEqual(res.body.results[1], first_results[3])).should.be.true;
          done();
        });
      });
  });
      
});
