python unify_code_files.py
ddlgenerator --inserts --drops --force-key --key=id_ postgresql all_codes.json > all_codes.sql
psql -f all_codes.sql -U postgres codetalker 
psql -e -f derived_tables.sql -U postgres codetalker 
