import re
import doctest

with open("raw_layout_paste.txt") as infile:
    content = infile.read()

column_name_pattern = re.compile(r"^([A-Z \-\.]+)(\((.*?)\))?(:.*?See \*\*Counter Examples.)?$")
def take(line):
    return (line != 'CHAR') and column_name_pattern.search(line) 

smooshed_line_pattern = re.compile(r"^((.{6}).*?)(\2.*)$")
def unsmoosh(line):
    """
    >>> unsmoosh("just a line")
    ['just a line']
    >>> unsmoosh("GOVT_BUS_STATE_OR_PROVINCE_GOVT_BUS_US_PHONE")
    ['GOVT_BUS_STATE_OR_PROVINCE_', 'GOVT_BUS_US_PHONE']
    """
    found = smooshed_line_pattern.search(line)
    if not found:
        return [line, ]
    result = [found.group(1), ]
    result.extend(unsmoosh(found.group(3)))
    return result
        
def main():
    with open("mechanically_split_layout.sql", "w") as outfile:
        outfile.write("-- Requires manual work to split lines wrongly joined in the paste\n")
        outfile.write("-- beware: SIC_CODE_STRING, END-OF-RECORD, PREVIOUS_BUS_STATE_OR_PROVINCE\n")
        outfile.write("""DROP TABLE ccr_raw CASCADE;
    CREATE TABLE ccr_raw (
    CAGE_CODE TEXT,""")
        for unsplit_line in content.splitlines():
            use_me = take(unsplit_line)
            if use_me:
                for column_name in unsmoosh(use_me.group(1)):
                    if use_me.group(2) or use_me.group(4):
                        comment = "-- %s %s" % (use_me.group(2) or "", use_me.group(4) or "")
                    else:
                        comment = ""
                    column_name = column_name.strip(  ).replace(" ", "_").replace(".", "").replace("-", "_")
                    if use_me.group(3) and use_me.group(3).isdigit() and use_me.group(3) != '60':
                        column_name = "%s_%s" % (column_name, use_me.group(3))
                    column = "%s TEXT, %s\n" % (column_name, comment)
                    outfile.write(column)
        outfile.write(");")

if __name__ == '__main__':
    doctest.testmod()
    main()