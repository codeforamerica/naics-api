-- pare down database to a small set suitable for testing

DROP SCHEMA IF EXISTS snippet CASCADE;
CREATE SCHEMA snippet;
CREATE TABLE snippet.naics AS SELECT * FROM public.naics WHERE code < '11311';
ALTER TABLE snippet.naics ADD PRIMARY KEY (id);

INSERT INTO snippet.naics
SELECT DISTINCT n.* 
FROM   public.naics n
JOIN   public.crossrefs xr ON (xr.child_id = n.id)
JOIN   snippet.naics n1 ON (xr.naics_id = n1.id)
WHERE  n.id
NOT IN (SELECT id FROM snippet.naics);

CREATE TABLE snippet.crossrefs AS
  SELECT DISTINCT(xr.*)
  FROM   public.crossrefs xr
  JOIN   snippet.naics c1 ON (xr.naics_id = c1.id)
  JOIN   snippet.naics c2 ON (xr.child_id = c2.id);
  
ALTER TABLE snippet.crossrefs 
                              ADD FOREIGN KEY (naics_id) REFERENCES snippet.naics(id),
                              ADD FOREIGN KEY (child_id) REFERENCES snippet.naics(id);


CREATE TABLE snippet.cage_to_naics AS
  SELECT DISTINCT(n.*)
  FROM   public.cage_to_naics n
  JOIN   snippet.naics c ON (n.naics_id = c.id);
ALTER TABLE snippet.cage_to_naics ADD PRIMARY KEY (cage_id, naics_id),
                              ADD FOREIGN KEY (naics_id) REFERENCES snippet.naics(id);
  
CREATE TABLE snippet.cage AS
  SELECT r.*
  FROM   public.cage r
  WHERE  r.id IN (SELECT cage_id FROM snippet.cage_to_naics);
ALTER TABLE snippet.cage ADD PRIMARY KEY (id);
ALTER TABLE snippet.cage_to_naics ADD FOREIGN KEY (cage_id) REFERENCES snippet.cage(id);
