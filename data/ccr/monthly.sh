rm -rf *.csv
curl https://www.sam.gov/public-extracts/CCR-FOIA/CCR_FOIA_Extract.zip > monthly_data.zip
unzip monthly_data.zip
tail -n +2 *.csv > monthly.csv  # eliminate garbage first row
sed '$ d' monthly.csv  > shortened.csv # last row is also garbage
mv shortened.csv monthly.csv
psql -f ddl.sql codetalker
psql -c "copy ccr_raw from '/Users/catherinedevlin/werk/18fct/data/ccr/monthly.csv' delimiter ',' csv;" codetalker
psql -f reshape.sql codetalker



