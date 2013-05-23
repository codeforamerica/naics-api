var PORT    = process.env.port || 3000,
    restify = require('restify'),
    api     = require('./routes/api')

var app = restify.createServer()

app.use(restify.queryParser())

// Routes
app.get('/', function (req, res) {
  res.status(200)
  res.header('Content-Type', 'text/html')
  res.write('Welcome to the NAICS API. For more information, go to <a href="https://github.com/louh/naics-api">GitHub</a>.')
  res.end()
});
app.get('/q', api.v0.search.get)
app.get('/v0/q', api.v0.search.get)

app.listen( PORT, function () {
  console.log( "Listening on port " + PORT )
})
