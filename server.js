var config = require('config');
var restify = require('restify');
var api = require('./routes/api');
var fs = require('fs');

var app = restify.createServer();

app.use(restify.plugins.queryParser());
app.use(restify.plugins.fullResponse());

const corsMiddleware = require('restify-cors-middleware');
const cors = corsMiddleware({
  origins: ['*'],
  allowHeaders: ['Authorization'],
  exposeHeaders: ['Authorization']
});
app.pre(cors.preflight);
app.use(cors.actual);

// Routes
app.get('/', function (req, res, next) {
  var data = fs.readFileSync(__dirname + '/index.html');

  res.setHeader('Content-Type', 'text/html');
  res.send(200, data.toString().replace(/host:port/g, req.header('Host')));
  return next();
});
app.get('/v0/q', api.v0.query.get);
app.get('/v0/s', api.v0.search.get);
app.get('/api/v0/q', api.v0.query.get);
app.get('/api/v0/s', api.v0.search.get);
app.get('/.well-known/status', function (req, res, next) {
  var codes_2012 = require(process.cwd() + '/data/codes-2012');
  var missing_zoos = (codes_2012['712130'] === undefined);

  var status = {
    'status': (missing_zoos ? 'Missing data' : 'ok'),
    'updated': Math.floor((new Date()).getTime() / 1000),
    'dependencies': null,
    'resources': null,
  };

  res.send(status);
  return next();
});

app.listen(config.port, config.ip, function () {
  console.log("Listening on port " + config.port);
});
