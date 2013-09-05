#!/usr/bin/env python

from csv import DictReader
from urllib import urlopen, urlencode
from bs4 import BeautifulSoup

def find_examples(soup):
    ''' Generate a list of examples from a starting point.
    '''
    el = soup.find(id='middle-column').find(class_='inside').find(text='Illustrative Examples:')
    
    if not el:
        # Nothing.
        return
    
    for i in range(2):
        el = el.nextSibling
        
        if el.name != 'br':
            # There are supposed to be two breaks after "Illustrative Examples"
            return
    
    while True:
        el = el.nextSibling
    
        if el.name is not None:
            # Expected plain text here.
            return
        
        yield unicode(el)

        el = el.nextSibling
    
        if el.name != 'br':
            # Expected a break here
            return

for row in DictReader(urlopen('http://forever.codeforamerica.org.s3.amazonaws.com/NAICS/6-digit_2012_Codes.csv')):

    q = dict(code=row['2012 NAICS Code'], search='2012 NAICS Search')
    url = 'http://www.census.gov/cgi-bin/sssd/naics/naicsrch?' + urlencode(q)
    html = urlopen(url).read()
    soup = BeautifulSoup(html)
    
    print row['2012 NAICS Title']
    
    for example in find_examples(soup):
        print ' ', example
