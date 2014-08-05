from setuptools import setup

setup(name="codetalker",
version='0.1.0',
description='API for NAICS codes and related',
url='http://github.com/18f/codetalker',
author='18F.gsa.gov',
zip_safe=False,
install_requires = [
  'flask-restful',
  'flask-sqlalchemy',
  'psycopg2',
],
    packages=['codetalker'],
    package_dir={'codetalker': 'lib', 'tests': 'tests'},
    classifiers=['Development Status :: 2 - Pre-Alpha']
)
