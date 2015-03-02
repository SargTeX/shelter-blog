var bodyParser = require('body-parser'),
	config = require('./config/config.js'),
	db = require('mongoose'),
	express = require('express'),
	fs = require('fs'),
	jade = require('jade');
var app = express();

// connect to database
db.connect('mongodb://'+config.db.IP+':'+config.db.PORT+'/'+config.db.DATABASE);

// configure webserver
app.use(bodyParser.json({limit: '500kb', type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use("/css", express.static("./template/css"));

// enable autorendering templates
app.use(function(req, res, next) {
	var send = res.send.bind(res);
	res.send = function(content) {
		res.header({'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*'});
		if (typeof content === 'string') return send(content);
		if (!content.template) return send(content);
		if (!content.hasOwnProperty('data')) content.data = {};
		if (content.status == 'success' && !content.data.hasOwnProperty('status')) content.data.status = 'success';
		if (req.query.sessionId && res.locals.session && !content.data.hasOwnProperty('sessionId')) content.data.sessionId = req.query.sessionId;
		console.log(content);

		fs.readFile('./template/client/'+content.template+'.jade', function(err, tpl) {
			if (err) {
				console.log(err);
				return send('bambambam... error, sry pplz');
			}

			var fn = jade.compile(tpl, {filename: './template/client/'+content.template+'.jade'});
			var response = fn(content);
			send(response);
		});
	};
	next();
});

// add controllers to server
[
	'Home',
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