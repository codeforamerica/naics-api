# -*- coding: utf-8 -*-

import json
from sys import argv
from re import compile
from collections import defaultdict
import inflect
p = inflect.engine()

stop_words = '''a, about, above, after, again, against, all, am, an, and, any,
are, aren't, as, at, be, because, been, before, being, below, between, both,
but, by, can't, cannot, could, couldn't, did, didn't, do, does, doesn't, doing,
don't, down, during, each, few, for, from, further, had, hadn't, has, hasn't,
have, haven't, having, he, he'd, he'll, he's, her, here, here's, hers, herself,
him, himself, his, how, how's, i, i'd, i'll, i'm, i've, if, in, into, is,
isn't, it, it's, its, itself, let's, me, more, most, mustn't, my, myself, no,
nor, not, of, off, on, once, only, or, other, ought, our, ours , ourselves,
out, over, own, same, shan't, she, she'd, she'll, she's, should, shouldn't, so,
some, such, than, that, that's, the, their, theirs, them, themselves, then,
there, there's, these, they, they'd, they'll, they're, they've, this, those,
through, to, too, under, until, up, very, was, wasn't, we, we'd, we'll, we're,
we've, were, weren't, what, what's, when, when's, where, where's, which, while,
who, who's, whom, why, why's, with, won't, would, wouldn't, you, you'd, you'll,
you're, you've, your, yours, yourself, yourselves'''

stop_words += ', except'

whatever = compile(r'\S+')
breaks = compile(r'[\s\/\-\xa0]')
stops = compile(r',\s+').split(stop_words)
junk_ = compile(u'^[\s\;\:\,\.\!\?\(\)\"\'…“”‘’]+')
_junk = compile( u'[\s\;\:\,\.\!\?\(\)\"\'…“”‘’]+$')

# Adapted from http://stackoverflow.com/a/10297152/336353
# plurals = compile(r'(?<![aei])([ie][d])(?=[^a-zA-Z])|(?<=[ertkgwmnl])s$')

def cleanup(word):
    ''' Clean up a single word if it's got some obvious junk on it.
    '''
    word = word.replace('&nbsp;', ' ')
    word = junk_.sub('', _junk.sub('', word))
    word = word.lower().replace(u'’', "'")
    
    return word

def tokenize(text):
    ''' Tokenize a block of text into a set of search terms.
    '''

    #
    # Ignore "except" language
    #
    
    try:
      start = text.index('(except')
      end = text.index(')', start) + 1
      if end > start:
        text = text.replace(text[start:end], '')
    except:
      pass

    #
    # Clean up words and group them into ones, twos and threes.
    #

    words = map(cleanup, breaks.split(text))

    word_singles = [word for word in words if word not in stops]

    word_pairs = [(w1+' '+w2).strip() for (w1, w2)
                  in zip(words, words[1:])
                  if not (w1 in stops or w2 in stops)]

    word_triplets = [(w1+' '+w2+' '+w3).strip() for (w1, w2, w3)
                     in zip(words, words[1:], words[2:])
                     if not (w1 in stops or w3 in stops)]

    words_altogether = word_singles + word_pairs #+ word_triplets
    words_singular = [p.singular_noun(s) or s for s in words_altogether]
    
    # Include original and singular variants of words
    word_set = filter(None, set(words_singular + words_altogether))
    
    return word_set

def gen_terms(filename):
    ''' Generate tuples of (code, score, search term) for NAICS items in a file.

        {
          "code":236220,
          "title":"Commercial and Institutional Building Construction",
          "index":
          [
            "Addition, alteration and renovation for-sale builders, commercial and institutional building",
            "Addition, alteration and renovation for-sale builders, commercial warehouse",
            ...
          ],
          "examples":
          [
            "Airport building construction",
            "Office building construction",
            ...
          ],
          "description":
          [
            "This industry comprises establishments primarily responsible for the construction (including new work, additions, alterations, maintenance, and repairs) of commercial and institutional buildings and related structures, such as stadiums, grain elevators, and indoor swimming facilities.  This industry includes establishments responsible for the on-site assembly of modular or prefabricated commercial and institutional buildings.  Included in this industry are commercial and institutional building general contractors, commercial and institutional building for-sale builders, commercial and institutional building design-build firms, and commercial and institutional building project construction management firms."
          ],

          "crossrefs":
          [
            {"text":"Constructing structures that are integral parts of utility systems (e.g., storage tanks, pumping stations) or are used to produce products for these systems (e.g., power plants, refineries)--are classified in Industry Group 2371, Utility System Construction, based on type of construction project;","code":"2371"},
            {"text":"Performing specialized construction work on commercial and institutional buildings, generally on a subcontract basis--are classified in Subsector 238, Specialty Trade Contractors; and","code":"238"},
            {"text":"Constructing buildings on their own account for rent or lease--are classified in Industry Group 5311, Lessors of Real Estate.","code":"5311"}
          ],
          "seq_no":217
        }
    '''
    data = json.load(open(filename))

    fields = 'code', 'title', 'index', 'examples', 'description'
    scores = 5, 4, 3, 2, 1
    
    for item in data['items']:
        code = item['code']
    
        for (score, field) in zip(scores, fields):
            if field not in item:
                continue
        
            if field == 'code':
                yield (code, score, str(code))
        
            if field == 'title' and field in item:
                for word in tokenize(item['title']):
                    yield (code, score, word)
        
            if field in ('index', 'examples', 'description'):
                for word in tokenize(' '.join(item[field])):
                    yield (code, score, word)

if __name__ == '__main__':

    infile, outfile = argv[1:]

    with open(outfile, 'w') as out:
    
        #
        # index is a dictionary of lists.
        # Each list contains tuples of (score, code).
        #
        index = defaultdict(lambda: [])

        for (code, score, word) in gen_terms(infile):
            index[word].append((score, code))
        
        #
        # output is a dictionary of dicts.
        # Each dict is a mapping from NAICS code to score.
        #
        output = dict()
        
        for (word, results) in index.items():
            output[word] = defaultdict(lambda: 0)
            
            for (score, code) in results:
                output[word][code] += score
        
        json.dump(output, out, indent=2)
