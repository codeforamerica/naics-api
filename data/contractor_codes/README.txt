
Data is extracted from https://www.sam.gov/public-extracts/CCR-FOIA/CCR_FOIA_Extract.zip
and described at https://www.sam.gov/sam/transcript/BPNSE_Extract%20Layout%20Level%200%20FOIA.pdf.

We need a way to verify that the column layout has not changed.

Getting the table structure
---------------------------

Hopefully this will very rarely need to be done - only when verify_column_names.sh
reports a change in the columns.

1. ./verify_column_names.sh
2. Open layout.pdf in a PDF reader; copy and paste the text of the first
   (multi-page) table into `raw_layout_paste.txt`.  It's OK that the paste
   will include page headers and footers and will be generall gunky, that
   will be cleaned up.
3. python read_layout_from_pdf.py
4. cp mechanically_split_layout.sql ddl.sql
5. hand-edit ddl.sql.  The field PREVIOUS_BUS_STATE_OR_PROVINCE_GOVT_BUS_POC should be split back into two fields.
6. psql -f ddl.sql codetalker

Importing monthly data

CAGE code: unique DOD id
CCR: central contractor registry, another unique ID

NAICS code
SIC code
FSC code
PSC code

Note: NAICS codes in CCR have a letter suffix, generally Y, that does not exist in our NAICS.
Assuming they correspond anyway.

