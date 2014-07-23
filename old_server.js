var config      = require('config'),
    restify     = require('restify'),
    api         = require('./routes/api'),
    fs          = require('fs')

var app = restify.createServer()

app.use(restify.queryParser())
app.use(restify.CORS())
app.use(restify.fullResponse())

// Routes
app.get('/', function (req, res, next)
  {
    var data = fs.readFileSync(__dirname + '/index.html');

    res.status(200);
    res.header('Content-Type', 'text/html');
    res.end(data.toString().replace(/host:port/g, req.header('Host')));
  });

app.get('/v0/q', api.v0.query.get)
app.get('/v0/s', api.v0.search.get)
app.get('api/v0/q', api.v0.query.get)
app.get('api/v0/s', api.v0.search.get)

app.get('/.well-known/status', function (req, res, next)
  {
    var codes_2012 = require(process.cwd() + '/data/codes-2012'),
        missing_zoos = (codes_2012['712130'] == undefined);
    
    var status = {
            'status': (missing_zoos ? 'Missing data' : 'ok'),
            'updated': Math.floor((new Date()).getTime() / 1000),
            'dependencies': null,
            'resources': null,
        };
    
    res.send(status);
  });

app.listen(config.port, config.ip, function () {
  console.log( "Listening on port " + config.port )
})
