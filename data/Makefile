all: index-2007.json index-2012.json

index-2007.json: naics-2007.json:
	python inverse-index.py naics-2007.json index-2007.json

index-2012.json: naics-2012.json:
	python inverse-index.py naics-2012.json index-2012.json
