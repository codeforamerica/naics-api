DROP TABLE IF EXISTS code CASCADE;
CREATE TABLE code (
  id_     SERIAL NOT NULL PRIMARY KEY,
  code    VARCHAR NOT NULL,
  year    VARCHAR NOT NULL,
  title   VARCHAR,
  description      TEXT,
  examples         TEXT,
  index            TEXT,
  part_of_range    VARCHAR,
  trilateral       BOOLEAN,
  change_indicator INTEGER,
  seq_no  VARCHAR 
);

INSERT INTO code (
  id_, code, year, title, part_of_range, trilateral, change_indicator, seq_no
  ) SELECT
  id_, code, year, title, part_of_range, trilateral, change_indicator, seq_no
  FROM all_codes;

WITH c AS (
    SELECT c1.id_, 
           STRING_AGG(d3.description, '

') AS description
    FROM   all_codes c1
    JOIN   ( SELECT d2.all_codes_id,
                    d2.description 
             FROM   description d2 
             ORDER BY d2.all_codes_id, d2.id_ ASC ) d3
    ON     (c1.id_ = d3.all_codes_id)
    GROUP BY c1.id_
  )
UPDATE code c2
SET    description = c.description
FROM   c
WHERE  c2.id_ = c.id_;

WITH c AS (
    SELECT c1.id_, 
           STRING_AGG(d3.examples, '

') AS examples
    FROM   all_codes c1
    JOIN   ( SELECT d2.all_codes_id,
                    d2.examples 
             FROM   examples d2 
             ORDER BY d2.all_codes_id, d2.id_ ASC ) d3
    ON     (c1.id_ = d3.all_codes_id)
    GROUP BY c1.id_
  )
UPDATE code c2
SET    examples = c.examples
FROM   c
WHERE  c2.id_ = c.id_;

WITH c AS (
    SELECT c1.id_, 
           STRING_AGG(d3.index, '

') AS index
    FROM   all_codes c1
    JOIN   ( SELECT d2.all_codes_id,
                    d2.index 
             FROM   index d2 
             ORDER BY d2.all_codes_id, d2.id_ ASC ) d3
    ON     (c1.id_ = d3.all_codes_id)
    GROUP BY c1.id_
  )
UPDATE code c2
SET    index = c.index
FROM   c
WHERE  c2.id_ = c.id_;

ALTER TABLE crossrefs ADD CONSTRAINT fk_crossref_code FOREIGN KEY (all_codes_id)
  REFERENCES code (id_);
  
ALTER TABLE crossrefs DROP CONSTRAINT crossrefs_all_codes_id_fkey;

CREATE INDEX ON code(year);
CREATE INDEX ON code(code);
CREATE INDEX ON code(part_of_range);  -- TODO: exclude part_of_range!=NULL entirely?

-- TODO: good indexes
