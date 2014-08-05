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
            itm["id"] = "%s-%s" % (year_name, itm["code"])
            itm["year"] = year_name
            if "description" in itm:
                itm["description"] = "\n".join(itm["description"])
            if "examples" in itm:
                itm["examples"] = "\n".join(itm["examples"])
            if "crossrefs" in itm:
                for xref in itm["crossrefs"]:
                    if xref["code"] is None:
                        xref["child_id"] = None
                    else:
                        xref["child_id"] = "%s-%s" % (year_name, xref["code"])
                    xref["naics"] = xref.pop("code")
            result.append(itm)

with open("naics.json", "w") as outfile:
    json.dump(result, outfile, indent=2)
