var config = require('config'),
    express = require('express'),
    app     = express(),
    api     = require('./routes/api')

app.get('/', function (req, res) {
  res.send('Welcome to the NAICS API. For more information, go to <a href="https://github.com/louh/naics-api">GitHub</a>.');
});

app.get('/q', api.v0.search.get)
app.get('/v0/q', api.v0.search.get)

app.listen(config.port, function () {
  console.log( "Listening on port " + config.port )
})
