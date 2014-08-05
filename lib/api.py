from flask import Flask, jsonify, abort, request
from flask.ext.script import Manager
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext import restful
from flask.ext.restful import fields, marshal_with
from sqlalchemy_jsonapi import JSONAPI, JSONAPIMixin
import dateutil.parser

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://:@/codetalker"

api = restful.Api(app)
db = SQLAlchemy(app)
manager = Manager(app)

# TODO: extract models to their own module
# TODO: do not return "linked" with results

class NoLinkedMixin(JSONAPIMixin):
    jsonapi_relationships_exclude = ['linked', ]
  
class CageModel(NoLinkedMixin, db.Model):
    __tablename__ = 'cage'

    id = db.Column(db.Text, primary_key=True, index=True)
    ccr_extract_code = db.Column(db.Text)
    registration_date = db.Column(db.Text)
    renewal_date = db.Column(db.Text)
    legal_bus_name = db.Column(db.Text)
    dba_name = db.Column(db.Text)
    company_division = db.Column(db.Text)
    division_number = db.Column(db.Text)
    st_add_1 = db.Column(db.Text)
    st_add_2 = db.Column(db.Text)
    city = db.Column(db.Text)
    state_or_province = db.Column(db.Text)
    postal_code = db.Column(db.Text)
    country_code = db.Column(db.Text)
    bus_start_date = db.Column(db.Text)
    fiscal_year_end_close_date = db.Column(db.Text)
    corporate_url = db.Column(db.Text)
    organizational_type = db.Column(db.Text)
    state_of_inc = db.Column(db.Text)
    country_of_inc = db.Column(db.Text)
    credit_card = db.Column(db.Text)
    correspondence_flag = db.Column(db.Text)
    edi = db.Column(db.Text)
    avg_number_of_employees = db.Column(db.Text)
    annual_receipts = db.Column(db.Text)
    authorization_date = db.Column(db.Text)
    eft_waiver = db.Column(db.Text)
    mailing_add_poc = db.Column(db.Text)
    mailing_add_st_add_1 = db.Column(db.Text)
    mailing_add_st_add_2 = db.Column(db.Text)
    mailing_add_city = db.Column(db.Text)
    mailing_add_postal_code = db.Column(db.Text)
    mailing_add_country_code = db.Column(db.Text)
    mailing_add_state_or_province = db.Column(db.Text)
    previous_bus_poc = db.Column(db.Text)
    previous_bus_st_add_1 = db.Column(db.Text)
    previous_bus_st_add_2 = db.Column(db.Text)
    previous_bus_city = db.Column(db.Text)
    previous_bus_postal_code = db.Column(db.Text)
    previous_bus_country_code = db.Column(db.Text)
    previous_bus_state_or_province = db.Column(db.Text)
    govt_bus_poc = db.Column(db.Text)
    govt_bus_st_add_1 = db.Column(db.Text)
    govt_bus_st_add_2 = db.Column(db.Text)
    govt_bus_city = db.Column(db.Text)
    govt_bus_postal_code = db.Column(db.Text)
    govt_bus_country_code = db.Column(db.Text)
    govt_bus_state_or_province = db.Column(db.Text)
    govt_bus_us_phone = db.Column(db.Text)
    govt_bus_us_phone_ext = db.Column(db.Text)
    govt_bus_non_us_phone = db.Column(db.Text)
    govt_bus_fax_us_only = db.Column(db.Text)
    govt_bus_email = db.Column(db.Text)
    alt_govt_bus_poc = db.Column(db.Text)
    alt_govt_bus_st_add_1 = db.Column(db.Text)
    alt_govt_bus_st_add_2 = db.Column(db.Text)
    alt_govt_bus_city = db.Column(db.Text)
    alt_govt_bus_postal_code = db.Column(db.Text)
    alt_govt_bus_country_code = db.Column(db.Text)
    alt_govt_bus_state_or_province = db.Column(db.Text)
    alt_govt_bus_us_phone = db.Column(db.Text)
    alt_govt_bus_us_phone_ext = db.Column(db.Text)
    alt_govt_bus_non_us_phone = db.Column(db.Text)
    alt_govt_bus_fax_us_only = db.Column(db.Text)
    alt_govt_bus_email = db.Column(db.Text)
    past_perf_poc = db.Column(db.Text)
    past_perf_st_add_1 = db.Column(db.Text)
    past_perf_st_add_2 = db.Column(db.Text)
    past_perf_city = db.Column(db.Text)
    past_perf_postal_code = db.Column(db.Text)
    past_perf_country_code = db.Column(db.Text)
    past_perf_state_or_province = db.Column(db.Text)
    past_perf_us_phone = db.Column(db.Text)
    past_perf_us_phone_ext = db.Column(db.Text)
    past_perf_non_us_phone = db.Column(db.Text)
    past_perf_fax_us_only = db.Column(db.Text)
    past_perf_email = db.Column(db.Text)
    alt_past_perf_poc = db.Column(db.Text)
    alt_past_perf_st_add_1 = db.Column(db.Text)
    alt_past_perf_st_add_2 = db.Column(db.Text)
    alt_past_perf_city = db.Column(db.Text)
    alt_past_perf_postal_code = db.Column(db.Text)
    alt_past_perf_country_code = db.Column(db.Text)
    alt_past_perf_state_or_province = db.Column(db.Text)
    alt_past_perf_us_phone = db.Column(db.Text)
    alt_past_perf_us_phone_ext = db.Column(db.Text)
    alt_past_perf_non_us_phone = db.Column(db.Text)
    alt_past_perf_fax_us_only = db.Column(db.Text)
    alt_past_perf_email = db.Column(db.Text)
    elec_bus_poc = db.Column(db.Text)
    elec_bus_st_add_1 = db.Column(db.Text)
    elec_bus_st_add_2 = db.Column(db.Text)
    elec_bus_city = db.Column(db.Text)
    elec_bus_postal_code = db.Column(db.Text)
    elec_bus_country_code = db.Column(db.Text)
    elec_bus_state_or_province = db.Column(db.Text)
    elec_bus_us_phone = db.Column(db.Text)
    elec_bus_us_phone_ext = db.Column(db.Text)
    elec_bus_non_us_phone = db.Column(db.Text)
    elec_bus_fax_us_only = db.Column(db.Text)
    elec_bus_email = db.Column(db.Text)
    alt_elec_bus_poc = db.Column(db.Text)
    alt_elec_bus_st_add_1 = db.Column(db.Text)
    alt_elec_bus_st_add_2 = db.Column(db.Text)
    alt_elec_bus_city = db.Column(db.Text)
    alt_elec_bus_postal_code = db.Column(db.Text)
    alt_elec_bus_country_code = db.Column(db.Text)
    alt_elec_bus_state_or_province = db.Column(db.Text)
    alt_elec_bus_us_phone = db.Column(db.Text)
    alt_elec_bus_us_phone_ext = db.Column(db.Text)
    alt_elec_bus_non_us_phone = db.Column(db.Text)
    alt_elec_bus_fax_us_only = db.Column(db.Text)
    alt_elec_bus_email = db.Column(db.Text)
    certifier_poc = db.Column(db.Text)
    certifier_us_phone = db.Column(db.Text)
    certifier_us_phone_ext = db.Column(db.Text)
    certifier_non_us_phone = db.Column(db.Text)
    certifier_fax_us_only = db.Column(db.Text)
    certifier_email = db.Column(db.Text)
    alt_certifier_poc = db.Column(db.Text)
    alt_certifier_us_phone = db.Column(db.Text)
    alt_certifier_us_phone_ext = db.Column(db.Text)
    alt_certifier_non_us_phone = db.Column(db.Text)
    alt_certifier_fax_us_only = db.Column(db.Text)
    alt_certifier_email = db.Column(db.Text)
    corp_info_poc = db.Column(db.Text)
    corp_info_us_phone = db.Column(db.Text)
    corp_info_us_phone_ext = db.Column(db.Text)
    corp_info_non_us_phone = db.Column(db.Text)
    corp_info_fax_us_only = db.Column(db.Text)
    corp_info_email = db.Column(db.Text)
    owner_info_poc = db.Column(db.Text)
    owner_info_us_phone = db.Column(db.Text)
    owner_info_us_phone_ext = db.Column(db.Text)
    owner_info_non_us_phone = db.Column(db.Text)
    owner_info_fax_us_only = db.Column(db.Text)
    owner_info_email = db.Column(db.Text)
    bus_type_counter = db.Column(db.Text)
    bus_type_string = db.Column(db.Text)
    sic_code_counter = db.Column(db.Text)
    sic_code_strint = db.Column(db.Text)
    naics_code_counter = db.Column(db.Text)
    naics_code_string = db.Column(db.Text)
    fsc_code_counter = db.Column(db.Text)
    fsc_code_string = db.Column(db.Text)
    psc_code_counter = db.Column(db.Text)
    psc_code = db.Column(db.Text)
    end_of_record_flag = db.Column(db.Text)

    naicss = db.relationship('NaicModel', secondary='cage_to_naics', backref='cages')


t_cage_to_naics = db.Table(
    'cage_to_naics',
    db.Column('cage_id', db.ForeignKey('cage.id'), primary_key=True, nullable=False),
    db.Column('naics_id', db.ForeignKey('naics.id'), primary_key=True, nullable=False)
)


t_cage_to_naics_raw = db.Table(
    'cage_to_naics_raw',
    db.Column('cage_id', db.Text),
    db.Column('naics', db.Text)
)


t_crossrefs = db.Table(
    'crossrefs', 
    db.Column('text', db.String(435), nullable=False),
    db.Column('child_id', db.ForeignKey('naics.id')),
    db.Column('naics', db.String(6)),
    db.Column('naics_id', db.ForeignKey('naics.id'), nullable=False)
)


t_index = db.Table(
    'index',
    db.Column('index', db.String(186), nullable=False),
    db.Column('naics_id', db.ForeignKey('naics.id'), nullable=False)
)

class NoLinkedMixin(JSONAPIMixin):
    jsonapi_relationships_exclude = ['linked', ]

class NaicModel(NoLinkedMixin, db.Model):

    __tablename__ = 'naics'

    jsonapi_relationships_exclude = ['linked', ]
    
    id = db.Column(db.String(11), primary_key=True)
    _year = db.Column(db.Integer, nullable=False, index=True)
    seq_no = db.Column(db.Integer)
    code = db.Column(db.String(6), nullable=False, index=True)
    title = db.Column(db.String(118))
    description = db.Column(db.String(5963))
    description_code = db.Column(db.Integer)
    part_of_range = db.Column(db.String(5), index=True)
    examples = db.Column(db.String(668))
    trilateral = db.Column(db.Boolean)
    change_indicator = db.Column(db.Integer)

    crossrefs = db.relationship("NaicModel",
                        secondary=t_crossrefs,
                        primaryjoin=id==t_crossrefs.c.naics_id,
                        secondaryjoin=id==t_crossrefs.c.child_id,
                        backref="crossref_of"
                        )

class OneResource(restful.Resource):
    
    def get(self, id):
        qry = self.model.query.filter_by(id=id)
        result = self.serializer.serialize(qry)
        if not result[self.resource_name]:
            abort(404)
            #raise MissingResource('%s %s not found' % (self.resource_name, id))
        return result

class Naics(OneResource):
    resource_name = 'naics'
    serializer = JSONAPI(NaicModel)
    model = NaicModel
    
    
class Cage(OneResource):
    resource_name = 'cage'
    serializer = JSONAPI(CageModel)
    model = CageModel

class NaicsQuery(Naics):
   
    years = [2007, 2012]
    
    def _year_from_datestring(self, datestring):
        if not datestring:
            return self.years[-1]
        try:
            dt = dateutil.parser.parse(datestring)
        except TypeError:
            abort(400)
        years_before = [y for y in self.years if y <= dt.year]
        if not years_before:
            abort(404)
        return years_before[-1]
    
    def get(self, **kwarg):
        year = self._year_from_datestring(request.args.get('date'))
        qry = NaicModel.query.filter_by(_year=year)
        try:
            limit = min(int(request.args.get('limit', 25)), 50)
        except TypeError:
            abort(500)
        qry = qry.limit(limit)
        result = self.serializer.serialize(qry)
        return result



api.add_resource(Naics, '/api/NAICS/<string:id>')
api.add_resource(Cage, '/api/CAGE/<string:id>')
api.add_resource(NaicsQuery, '/api/q')

if __name__ == '__main__':
    app.run(debug=True)    
 