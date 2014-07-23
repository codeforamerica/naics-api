-- pare down database to a small set suitable for testing

DROP SCHEMA IF EXISTS snippet CASCADE;
CREATE SCHEMA snippet;
CREATE TABLE snippet.code AS SELECT * FROM public.code WHERE code < '11311';
ALTER TABLE snippet.code ADD PRIMARY KEY (id_);

CREATE TABLE snippet.crossrefs AS
  SELECT DISTINCT(xr.*)
  FROM   public.crossrefs xr
  JOIN   snippet.code c ON (xr.all_codes_id = c.id_);
ALTER TABLE snippet.crossrefs ADD PRIMARY KEY (id_),
                              ADD FOREIGN KEY (all_codes_id) REFERENCES snippet.code(id_);

CREATE TABLE snippet.ccr_naics AS
  SELECT DISTINCT(n.*)
  FROM   public.ccr_naics n
  JOIN   snippet.code c ON (n.naics_id = c.id_);
ALTER TABLE snippet.ccr_naics ADD PRIMARY KEY (cage_code, naics_id),
                              ADD FOREIGN KEY (naics_id) REFERENCES snippet.code(id_);
  
CREATE TABLE snippet.ccr_raw AS
  SELECT r.*
  FROM   public.ccr_raw r
  WHERE  r.cage_code IN (SELECT cage_code FROM snippet.ccr_naics);
ALTER TABLE snippet.ccr_raw ADD PRIMARY KEY (cage_code);
ALTER TABLE snippet.ccr_naics ADD FOREIGN KEY (cage_code) REFERENCES snippet.ccr_raw(cage_code);
