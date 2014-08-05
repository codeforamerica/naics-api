import json
import unittest
from nose.tools import *
from codetalker.lib.api import app

class TestCodetalker(unittest.TestCase):

    def setUp(self):
        self.test_client = app.test_client()

    def _years(self, response):
        result = set(r.get("_year") for r in response["naics"])
        return result
    
    def testValidDateGiven(self): 
        """should respond with JSON array of correct year when given a valid YYYYMMDD date"""
        response = json_response(self.test_client.get(r"/api/q?date=20100602"), 200)
        assert_equal(self._years(response), set([2007,]))
        
    def testDateNotGiven(self):
        """should give results only from latest year when no ``date`` parameter"""
        response = json_response(self.test_client.get(r"/api/q?date=20140602"), 200)
        assert_equal(self._years(response), set([2012,]))
        
    def testBadDateGiven(self):
        """should return 400 Bad Request when given uninterpretable ``date`` parameter"""
        json_response(self.test_client.get(r"/api/q?date=platypus"), 400)
        
    def testDateTooEarly(self):
        """should return 404 when given date before earliest year available"""
        json_response(self.test_client.get(r"/api/q?date=17760704"), 404)
      
    def testLimitParameter(self):
        """should return 10 records if ``limit=10`` parameter"""
        response = json_response(self.test_client.get(r"/api/q?date=20140602&limit=10"), 200)
        assert_equal(len(response["naics"]), 10)
 
    def testNoLimitSpecified(self):
        """should return 25 records if ``limit`` parameter omitted"""
        response = json_response(self.test_client.get(r"/api/q?date=20140602"), 200)
        assert_equal(len(response["naics"]), 25)
        
    def testLimitSetTooHigh(self):
        """should return 50 records if ``limit`` set > 50"""
        response = json_response(self.test_client.get(r"/api/q?date=20140602&limit=100"), 200)
        assert_equal(len(response["naics"]), 50)
        
    def testAllFieldsByDefault(self):
        """should return all fields if ``field`` parameter omitted"""
        response = json_response(self.test_client.get(r"/api/q?date=20140602&limit=1"), 200)
        result = response["naics"][0] 
        assert_in("code", result)
        assert_in("title", result)
        assert_in("description", result)
        assert_in("examples", result)

    def testGetValidNAICS(self): 
        """should respond with one NAICS resource when valid ID requested"""
        response = json_response(self.test_client.get(r"/api/NAICS/2007-11111"), 200)
        assert_in("naics", response)
        
    def testGetInvalidNAICS(self): 
        """should respond 404 Not Fpund when invalid NAICS ID requested"""
        response = json_response(self.test_client.get(r"/api/NAICS/platypus"), 404)
   
    def testGetValidCAGE(self): 
        """should respond with one NAICS resource when valid CAGE code requested"""
        response = json_response(self.test_client.get(r"/api/CAGE/4E8U7"), 200)
        assert_in("cage", response)
        
    def testGetInvalidCAGE(self): 
        """should respond 404 Not Fpund when invalid CAGE code requested"""
        response = json_response(self.test_client.get(r"/api/CAGE/platypus"), 404)
 
def json_response(response, code=200):
    '''Checks that the status code is OK and returns the json as a dict.'''
    assert_equal(response.status_code, code)
    return json.loads(response.data.decode('utf8'))

if __name__ == '__main__':
    unittest.main()
