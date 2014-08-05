CREATE INDEX ON cage (cage_code);

-- Rogue duplicate CAGE codes must be destroyed.  Here are the villains:

SELECT * FROM (
SELECT cage_code, legal_bus_name, registration_date,
       rank() OVER (PARTITION BY cage_code ORDER BY registration_date DESC) AS r
FROM   cage
) subq WHERE r > 1;

-- and here is their terrible fate:

DELETE FROM cage
WHERE (cage_code, legal_bus_name, registration_date) IN (
    SELECT cage_code, legal_bus_name, registration_date FROM (
        SELECT cage_code, legal_bus_name, registration_date,
               rank() OVER (PARTITION BY cage_code ORDER BY registration_date DESC) AS r
        FROM   cage
    ) subq WHERE r > 1
);

ALTER TABLE cage RENAME COLUMN cage_code TO id;
ALTER TABLE cage ADD PRIMARY KEY (id);

-- set up many-to-many relationship between `code` and `cage`
-- in CAGE import, NAICS codes come with alphabetical suffixes that we will trim

DROP TABLE IF EXISTS cage_to_naics_raw CASCADE;
CREATE TABLE cage_to_naics_raw (
  cage_id TEXT ,
  naics TEXT);
  
INSERT INTO cage_to_naics_raw (cage_id, naics)
SELECT * FROM (
  SELECT  id,
          regexp_split_to_table(naics_code_string, '\s*\.\s*') AS naics
  FROM    cage ) ccr
WHERE  ccr.naics != '';
 
DROP TABLE IF EXISTS cage_to_naics CASCADE;
CREATE TABLE cage_to_naics (
  cage_id TEXT NOT NULL REFERENCES cage (id),
  naics_id TEXT NOT NULL REFERENCES naics (id),
  PRIMARY KEY (cage_id, naics_id)
  );

INSERT INTO cage_to_naics (cage_id, naics_id)
SELECT cage_id, 
      '2007-' || rtrim(naics, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ')
FROM  cage_to_naics_raw
WHERE '2007-' || rtrim(naics, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ')
IN    (SELECT id FROM naics);

INSERT INTO cage_to_naics (cage_id, naics_id)
SELECT cage_id, 
      '2012-' || rtrim(naics, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ')
FROM  cage_to_naics_raw
WHERE '2012-' || rtrim(naics, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ')
IN    (SELECT id FROM naics);

