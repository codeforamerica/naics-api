#!/bin/bash
# Verify that column layout for Legacy CCR Extracts Public ("FOIA") Data Package
# has not changed.

# This is insufficient verification, because it verifies that the file at the given
# URL has not changed, but will not detect if a different filename is linked from
# SAM.gov's Data Access - Entity Management page.  Verifying that will be hard
# because the page content is fetched through JavaScript.

curl https://www.sam.gov/sam/transcript/BPNSE_Extract%20Layout%20Level%200%20FOIA.pdf > layout.pdf

if [ "`md5 -q layout.pdf`" == "867dd77529eafe44f6575d65e749a8b5" ]
then
  echo "Layout confirmed"
else
  echo "Layout file changed"
  echo "Must update attach_column_headers.py"
  exit 1
fi

