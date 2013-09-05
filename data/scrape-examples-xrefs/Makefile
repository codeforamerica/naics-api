venv-scrape-naics: venv-scrape-naics/bin/activate

venv-scrape-naics/bin/activate: requirements.txt
	test -d venv-scrape-naics || virtualenv --no-site-packages venv-scrape-naics
	. venv-scrape-naics/bin/activate && pip install -Ur requirements.txt
	touch venv-scrape-naics/bin/activate
