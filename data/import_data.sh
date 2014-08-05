python gather_json_files.py
ddlgenerator --inserts --drops --key id postgresql naics.json > naics.sql
psql -f naics.sql -U postgres codetalker 
psql -c "CREATE INDEX ON naics (code); CREATE INDEX ON naics (_year); CREATE INDEX ON naics (part_of_range);" -U postgres codetalker 
psql -c "ALTER TABLE crossrefs ADD FOREIGN KEY (child_id) REFERENCES naics;" -U postgres codetalker
# psql -e -f derived_tables.sql -U postgres codetalker 
