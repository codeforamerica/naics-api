var port    = 3000,
    express = require('express'),
    app     = express(),
    api     = require('./routes/api')

app.get('/', function (req, res) {
  res.send('Welcome to the NAICS API.');
});

app.get('/q', api.v0.search.get)

app.listen(port);
console.log('Listening on port ' + port);