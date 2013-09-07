#!/usr/bin/env python

from re import compile
from csv import DictReader
from urllib import urlopen, urlencode
from bs4 import BeautifulSoup
from sys import stderr, argv
from json import dump

def find_examples(soup):
    ''' Generate a list of examples from a starting point.
    '''
    el = soup.find(text='Illustrative Examples:')
    
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
        
        if el.strip():
            # Make sure string is not empty
            yield unicode(el.strip())

        el = el.nextSibling
    
        if el.name != 'br':
            # Expected a break here
            return

def find_crossreferences(soup):
    '''
    '''
    el = soup.find(text=compile(r'^Cross-References.'))
    
    if not el:
        # Nothing.
        return
    
    el = el.nextSibling.nextSibling.nextSibling
    
    if el.name != 'ul':
        # Expected an unordered list after some blank lines.
        return
    
    for el in el.find_all('li'):
        code, text = None, ''
    
        for el in el.contents:
            if el.name == 'a':
                text += el.string
                code = el.string
            else:
                text += unicode(el)
        
        yield dict(code=code, text=text)

try:
    outfile = argv[1]
    results = {}
except IndexError:
    print >> stderr, 'Usage: %s <output file name>' % argv[0]
    exit(1)

# rows = list(DictReader(urlopen('http://forever.codeforamerica.org.s3.amazonaws.com/NAICS/6-digit_2012_Codes.csv')))
rows = list(DictReader(urlopen('http://forever.codeforamerica.org.s3.amazonaws.com/NAICS/2-digit_2012_Codes.csv')))

for (index, row) in enumerate(rows):

#    code = row['2012 NAICS Code']
    code = row['2012 NAICS US   Code']
    
#    print >> stderr, index + 1, 'of', len(rows), '-', code, '-', row['2012 NAICS Title']
    print >> stderr, index + 1, 'of', len(rows), '-', code, '-', row['2012 NAICS US Title']

    q = dict(code=code, search='2012 NAICS Search')
    url = 'http://www.census.gov/cgi-bin/sssd/naics/naicsrch?' + urlencode(q)
    html = urlopen(url).read()
    soup = BeautifulSoup(html)
    soup = soup.find(id='middle-column').find(class_='inside')
    
    results[code] = dict(examples=[], crossrefs=[])
    
    for example in find_examples(soup):
        results[code]['examples'].append(example)
    
    for crossref in find_crossreferences(soup):
        results[code]['crossrefs'].append(crossref)

with open(outfile, 'w') as out:
    dump(results, out, indent=2)
