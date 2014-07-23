"""
Generates a unified JSON of codes from all individual years' JSON files.
Adds a "year" field to each record.
"""

import glob
import json
import re

yearfinder = re.compile(r"codes\-(\d\d\d\d).json")

result = []
for filename in glob.glob("codes-*.json"):
    year_name = yearfinder.search(filename).group(1)
    with open(filename) as infile:
        data = json.load(infile)
        for itm in data.values(): 
            itm["year"] = year_name
            result.append(itm)

with open("all_codes.json", "w") as outfile:
    json.dump(result, outfile, indent=2)
