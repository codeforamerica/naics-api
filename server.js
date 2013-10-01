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
    fs.readFile(__dirname + '/index.html', function (err, data)
      {
        res.status(200)
        res.header('Content-Type', 'text/html')
        res.end(data)
        next()
      });
  });

app.get('/v0/q', api.v0.query.get)
app.get('/v0/s', api.v0.search.get)
app.get('api/v0/q', api.v0.query.get)
app.get('api/v0/s', api.v0.search.get)

app.listen(config.port, function () {
  console.log( "Listening on port " + config.port )
})
