var bodyParser = require('body-parser'),
	config = require('./config/config.js'),
	db = require('mongoose'),
	express = require('express');
var app = express();

// connect to database
db.connect('mongodb://'+config.db.IP+':'+config.db.PORT);

// configure webserver
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

// add controllers to server
[
	'Language',
	'Menu',
	'MenuItem',
	'Post',
	'User'
].map(function(controllerName) {
	require('./controller/'+controllerName+'.js').setup(app);
});

// fange Fehler ab
require('./router/ErrorRouter.js').setup(app);

var server = app.listen(2000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('started server on http://'+host+':'+port);
});