#!/usr/bin/env python

from re import compile
from csv import DictReader
from urllib import urlopen, urlencode
from bs4 import BeautifulSoup
from sys import stderr, argv
from json import dump

def find_description(soup):
    '''
    '''
    el = soup.find('h3')

    if not el:
        # Nothing.
        return

    # The description comes after the last h3, so we need to find the last one:
    while el.name == 'h3':
        # Go to next element if another h3 is encountered
        next_el = el.findNext('h3')
        if next_el:
            el = next_el
        else:
            break

    # For top-level 2-digit codes, the first line of the description is a "Sector as a Whole" subtitle in bold.
    subtitle = el.findNextSibling('b')
    if subtitle:
        el = subtitle
        yield el.string
        el = el.nextSibling.nextSibling  # Skip <br>'s after this

    el = el.nextSibling # The description isn't contained in an element, so must get next sibling.

    while True:

        if el.name is not None:
            # Expected plain text here.
            return

        if el.strip():
            # Make sure string is not empty
            yield unicode(el.strip())

        for i in range(2):
            # There are supposed to be two breaks after each block of text
            el = el.nextSibling

            if not el:
                # Nothing. End of NAICS entry.
                return

            if el.name != 'br':
                # Not a break, stop.
                break

        if el.name == 'br':
            # This should be last <br>, next sibling should be text
            el = el.nextSibling

        # Stop when you hit Cross-references or Illustrative examples
        if "Illustrative Examples:" in el:
            return

        if "Cross-References." in el:
            return


def find_description_code(soup):
    '''
    '''
    el = soup.find(text=compile(r'See industry description for'))

    if not el:
        # Nothing.
        return

    el = el.nextSibling

    if el.name != 'a':
        # Expected a link
        return

    el = el.string

    yield unicode(el)

try:
    outfile = argv[1]
    results = {}
except IndexError:
    print >> stderr, 'Usage: %s <output file name>' % argv[0]
    exit(1)

# rows = list(DictReader(urlopen('http://forever.codeforamerica.org.s3.amazonaws.com/NAICS/6-digit_2012_Codes.csv')))
rows = list(DictReader(urlopen('http://forever.codeforamerica.org.s3.amazonaws.com/NAICS/2-digit_2012_Codes.csv')))

i = 0

for (index, row) in enumerate(rows):

    i = i + 1

    if i == 100:
        break

#    code = row['2012 NAICS Code']
    code = row['2012 NAICS US   Code']
    
#    print >> stderr, index + 1, 'of', len(rows), '-', code, '-', row['2012 NAICS Title']
    print >> stderr, index + 1, 'of', len(rows), '-', code, '-', row['2012 NAICS US Title']

    q = dict(code=code, search='2012 NAICS Search')
    url = 'http://www.census.gov/cgi-bin/sssd/naics/naicsrch?' + urlencode(q)
    html = urlopen(url).read()
    soup = BeautifulSoup(html)
    soup = soup.find(id='middle-column').find(class_='inside')
    
    results[code] = dict(description=[], description_code='')
    
    for description in find_description(soup):
        results[code]['description'].append(description)
    
    for description_code in find_description_code(soup):
        results[code]['description_code'] = description_code

with open(outfile, 'w') as out:
    dump(results, out, indent=2)
