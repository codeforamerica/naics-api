from csv import DictReader
import json

rows = list(DictReader(open('77495-business-licenses.csv')))
output = dict()

for (index, row) in enumerate(rows):
    naics_id = str(row['NAICS'])
    business_cat = row['LIC_NUM'][:3]
    if naics_id in output.keys():
        if business_cat in output[naics_id]['business_categories']:
            count = output[naics_id]['business_categories'][business_cat] + 1
            output[naics_id]['business_categories'][business_cat] = count
        else:
            output[naics_id]['business_categories'][business_cat] = 1
            business_count = output[naics_id]['business_count'] + 1
            output[naics_id]['business_count'] = business_count
    else:
        output[naics_id] = {'business_categories':{business_cat:1}, 'business_count':1}

with open('business-cats.json', 'w') as out:
    json.dump(output, out, indent=2)