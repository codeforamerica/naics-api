var config      = require('config'),
    restify     = require('restify'),
    api         = require('./routes/api')

var app = restify.createServer()

app.use(restify.queryParser())
app.use(restify.CORS())
app.use(restify.fullResponse())

// Routes
app.get('/', function (req, res) {
  res.status(200)
  res.header('Content-Type', 'text/html')
  res.write('Welcome to the NAICS API. For more information, go to <a href="https://github.com/louh/naics-api">GitHub</a>.')
  res.end()
});
app.get('/q', api.v0.query.get)
app.get('/s', api.v0.search.get)
app.get('/v0/q', api.v0.query.get)
app.get('/v0/s', api.v0.search.get)

app.listen(config.port, function () {
  console.log( "Listening on port " + config.port )
})
