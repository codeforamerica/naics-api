CREATE INDEX ON ccr_raw (cage_code);

-- Rogue duplicate CAGE codes must be destroyed.  Here are the villains:

SELECT * FROM (
SELECT cage_code, legal_bus_name, registration_date,
       rank() OVER (PARTITION BY cage_code ORDER BY registration_date DESC) AS r
FROM   ccr_raw
) subq WHERE r > 1;

-- and here is their terrible fate:

DELETE FROM ccr_raw
WHERE (cage_code, legal_bus_name, registration_date) IN (
    SELECT cage_code, legal_bus_name, registration_date FROM (
        SELECT cage_code, legal_bus_name, registration_date,
               rank() OVER (PARTITION BY cage_code ORDER BY registration_date DESC) AS r
        FROM   ccr_raw
    ) subq WHERE r > 1
);

ALTER TABLE ccr_raw ADD PRIMARY KEY (cage_code);

-- set up many-to-many relationship between `code` and `ccr_raw`

DROP TABLE IF EXISTS ccr_naics_raw CASCADE;
CREATE TABLE ccr_naics_raw (
  cage_code  TEXT ,
  naics_raw TEXT,
  naics TEXT );
  
INSERT INTO ccr_naics_raw (cage_code, naics_raw)
SELECT * FROM (
  SELECT  cage_code,
          regexp_split_to_table(naics_code_string, '\s*\.\s*') AS naics
  FROM    ccr_raw ) ccr
WHERE  ccr.naics != '';
  
UPDATE ccr_naics_raw
SET    naics = rtrim(naics_raw, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ');

DROP TABLE IF EXISTS ccr_naics CASCADE;
CREATE TABLE ccr_naics (
  cage_code TEXT REFERENCES ccr_raw,
  naics_id INTEGER REFERENCES code (id_),
  PRIMARY KEY (cage_code, naics_id)
  );
  
INSERT INTO ccr_naics (cage_code, naics_id)
SELECT cn.cage_code, c.id_ FROM ccr_naics_raw cn JOIN code c ON (cn.naics = c.code);


DROP TABLE IF EXISTS ccr_naics_raw CASCADE;

-- Build agglomerated contact fields

ALTER TABLE ccr_raw
ADD COLUMN 
  full_address TEXT
;

UPDATE ccr_raw
SET    full_address = FORMAT(
'%s%s%s
%s, %s %s %s', st_add_1,
  CASE st_add_2 WHEN '' THEN '' ELSE '
' END, st_add_2,
city, state_or_province, postal_code, country_code);

ALTER TABLE ccr_raw
ADD COLUMN 
  full_mailing_address TEXT
;

UPDATE ccr_raw
SET    full_mailing_address = FORMAT(
'%s%s%s
%s, %s %s %s', mailing_add_st_add_1,
  CASE mailing_add_st_add_2 WHEN '' THEN '' ELSE '
' END, mailing_add_st_add_2,
mailling_add_city, mailling_add_state_or_province, mailling_add_postal_code, mailling_add_country_code);

ALTER TABLE ccr_raw
ADD COLUMN 
  full_previous_bus_address TEXT
;

UPDATE ccr_raw
SET    full_previous_bus_address = FORMAT(
'%s%s%s
%s, %s %s %s', previous_bus_st_add_1,
  CASE previous_bus_st_add_2 WHEN '' THEN '' ELSE '
' END, previous_bus_st_add_2,
previous_bus_city, previous_bus_state_or_province, previous_bus_postal_code, previous_bus_country_code);

ALTER TABLE ccr_raw
ADD COLUMN 
  full_govt_bus_address TEXT
;

UPDATE ccr_raw
SET    full_govt_bus_address = FORMAT(
'%s%s%s
%s, %s %s %s', govt_bus_st_add_1,
  CASE govt_bus_st_add_2 WHEN '' THEN '' ELSE '
' END, govt_bus_st_add_2,
govt_bus_city, govt_bus_state_or_province, govt_bus_postal_code, govt_bus_country_code);

ALTER TABLE ccr_raw
ADD COLUMN 
  full_alt_govt_bus_address TEXT
;

UPDATE ccr_raw
SET    alt_govt_bus_full_address = FORMAT(
'%s%s%s
%s, %s %s %s', alt_govt_bus_st_add_1,
  CASE alt_govt_bus_st_add_2 WHEN '' THEN '' ELSE '
' END, alt_govt_bus_st_add_2,
alt_govt_bus_city, alt_govt_bus_state_or_province, alt_govt_bus_postal_code, alt_govt_bus_country_code);

ALTER TABLE ccr_raw
ADD COLUMN 
  full_past_perf_address TEXT
;

UPDATE ccr_raw
SET    full_past_perf_address = FORMAT(
'%s%s%s
%s, %s %s %s', past_perf_st_add_1,
  CASE past_perf_st_add_2 WHEN '' THEN '' ELSE '
' END, past_perf_st_add_2,
past_perf_city, past_perf_state_or_province, past_perf_postal_code, past_perf_country_code);

ALTER TABLE ccr_raw
ADD COLUMN 
  full_alt_past_perf_address TEXT
;

UPDATE ccr_raw
SET    full_alt_past_perf_address = FORMAT(
'%s%s%s
%s, %s %s %s', alt_past_perf_st_add_1,
  CASE alt_past_perf_st_add_2 WHEN '' THEN '' ELSE '
' END, alt_past_perf_st_add_2,
alt_past_perf_city, alt_past_perf_state_or_province, alt_past_perf_postal_code, alt_past_perf_country_code);

ALTER TABLE ccr_raw
ADD COLUMN 
  full_elec_bus_address TEXT
;

UPDATE ccr_raw
SET    full_elec_bus_address = FORMAT(
'%s%s%s
%s, %s %s %s', elec_bus_st_add_1,
  CASE elec_bus_st_add_2 WHEN '' THEN '' ELSE '
' END, elec_bus_st_add_2,
elec_bus_city, elec_bus_state_or_province, elec_bus_postal_code, elec_bus_country_code);



-- Extract into many-to-many

/*


CREATE TABLE contact (
  id               SERIAL PRIMARY KEY,
  poc              TEXT,
  street_address_1 TEXT,
  street_address_2 TEXT,
  city             TEXT,
  postal_code      TEXT,
  country_code     TEXT,
  state_or_province TEXT,
  full_address      TEXT,
  phone             TEXT,
  non_us_phone      TEXT,
  email             TEXT
);

CREATE TABLE ccr_contact (
  cage_code TEXT REFERENCES ccr_raw (cage_code),
  contact_id INTEGER REFERENCES contact (id),
  type TEXT
);

INSERT INTO contact (poc, street_address_1, street_address_2, city, postal_code,
                     country_code, state_or_province, phone, non_us_phone, email)
SELECT NULL, st_add_1, st_add_2, city, postal_code,
       country_code, state_or_province, NULL, NULL, NULL
FROM   ccr_raw
RETURNING

*/