var request = require('request')

describe('Querying NAICS by year', function () {
  
  it('should return all 2,328 entries for year 2007', function (done) {
    request('http://localhost:3000/q?year=2007', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(jbody.length).toEqual(2328)
      done()
    })
  })

  it('should return all 2,209 entries for year 2012', function (done) {
    request('http://localhost:3000/q?year=2012', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(jbody.length).toEqual(2209)
      done()
    })
  })

  it('should return 1,250 entries for year 2012 when entries without full descriptions are collapsed', function (done) {
    request('http://localhost:3000/q?year=2012&collapse=1', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(jbody.length).toEqual(1250)
      done()
    })
  })

  it('should return an array of 10 results for page 3, limit 10 in year 2012', function (done) {
    request('http://localhost:3000/q?year=2012&page=3&limit=10', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(jbody.length).toEqual(10)
      expect(jbody[0].code).toEqual(111211)
      expect(jbody[9].code).toEqual(111332)
      done()
    })
  })

  it('should return error 404 for NAICS years 2002 and 1997', function (done) {
    request('http://localhost:3000/q?year=2002', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(response.statusCode).toEqual(404)
      expect(jbody.http_status).toEqual(404)
      done()
    })
    request('http://localhost:3000/q?year=1997', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(response.statusCode).toEqual(404)
      expect(jbody.http_status).toEqual(404)
      done()
    })
  })

  it('should return error 400 if a year is not provided, or any other year is provided', function (done) {
    request('http://localhost:3000/q?', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(response.statusCode).toEqual(400)
      expect(jbody.http_status).toEqual(400)      
      done()
    })

    request('http://localhost:3000/q?year=2005', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(response.statusCode).toEqual(400)
      expect(jbody.http_status).toEqual(400)
      done()
    })

  })

})

describe('Querying for a single NAICS code', function () {
  
  it('should return all information for NAICS code 541430 in year 2012', function (done) {
    request('http://localhost:3000/q?year=2012&code=541430', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(jbody.code).toEqual(541430)
      expect(jbody.title).toEqual('Graphic Design Services')
      expect(jbody.index).toBeDefined()
      done()
    })
  })

  it('should return all information for NAICS code 31-33 in year 2012', function (done) {
    request('http://localhost:3000/q?year=2012&code=31-33', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(jbody.code).toEqual('31-33')
      expect(jbody.title).toEqual('Manufacturing')
      done()
    })
  })

  it('should return information for 31-33 if NAICS code 31, 32, or 33 is requested in year 2012', function (done) {
    request('http://localhost:3000/q?year=2012&code=31', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(jbody.code).toEqual('31-33')
      expect(jbody.title).toEqual('Manufacturing')
      done()
    })

    request('http://localhost:3000/q?year=2012&code=32', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(jbody.code).toEqual('31-33')
      expect(jbody.title).toEqual('Manufacturing')
      done()
    })

    request('http://localhost:3000/q?year=2012&code=33', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(jbody.code).toEqual('31-33')
      expect(jbody.title).toEqual('Manufacturing')
      done()
    })

  })

  it('should return error 404 if the code is not found', function (done) {
    request('http://localhost:3000/q?year=2012&code=541439', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(response.statusCode).toEqual(404)
      expect(jbody.http_status).toEqual(404)
      done()
    })
  })

})


describe('Querying for all codes above in the hierarchy for a given NAICS code', function () {
  
  it('should return an array of 4 results for code 541430 in year 2012, while excluding 541430', function (done) {
    request('http://localhost:3000/q?year=2012&code=541430&above=1', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(jbody.length).toEqual(4)
      expect(jbody[0].code).toEqual(54)
      expect(jbody[3].code).toEqual(54143)
      done()
    })
  })

})

describe('Querying for all codes below in the hierarchy for a given NAICS code', function () {
  
  it('should return an array of 93 results for code 54 in year 2012, while excluding 54', function (done) {
    request('http://localhost:3000/q?year=2012&code=54&below=1', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(jbody.length).toEqual(93)
      expect(jbody[0].code).toEqual(541)
      expect(jbody[38].code).toEqual(541430)
      expect(jbody[92].code).toEqual(541990)
      done()
    })
  })

  it('should return an array of 8 results for the above test when page is 3 and limit is 8', function (done) {
    request('http://localhost:3000/q?year=2012&code=54&below=1&page=3&limit=8', function (error, response, body) {
      var jbody = JSON.parse(body)
      expect(jbody.length).toEqual(8)
      expect(jbody[0].code).toEqual(54131)
      expect(jbody[7].code).toEqual(541340)
      done()
    })
  })

})

