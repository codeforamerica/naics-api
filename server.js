var PORT    = 3000,
    express = require('express'),
    app     = express(),
    api     = require('./routes/api')

app.get('/', function (req, res) {
  res.send('Welcome to the NAICS API.');
});

app.get('/q', api.v0.search.get)

app.configure(function () {
  app.set( "port", process.env.PORT || PORT )
//  app.use( express.static( path.join( __dirname, "public") ) )
})

app.listen( app.get("port"), function () {
  console.log( "Listening on port " + app.get("port") )
})