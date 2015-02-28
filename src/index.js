var bodyParser = require('body-parser'),
	config = require('./config/config.js'),
	db = require('mongoose'),
	express = require('express'),
	fs = require('fs'),
	jade = require('jade'),
	Session = require('./model/Session.js'),
	Language = require('./model/Language.js'),
	LanguageVariable = require('./model/LanguageVariable.js');
var app = express();

// connect to database
db.connect('mongodb://'+config.db.IP+':'+config.db.PORT+'/'+config.db.NAME);

// configure webserver
app.use("/css", express.static("./template/css"));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

// load language variables - all of them!
var variables = {};
LanguageVariable.find({})
	.exec(function(err, items) {
		if (err) throw err;

		console.log(items.length+' Variablen');
		for (var i = 0; i < items.length; ++i) {
			var item = items[i];
			if (!variables.hasOwnProperty(item.language)) variables[item.language] = {};
			variables[item.language][item.name] = item.translation;
		}
	});

// load default language
var defaultLanguage = null;
Language.findOne({default: true})
	.exec(function(err, item) {
		if (err) throw err;

		defaultLanguage = item;
	});

// enable autorendering templates
app.use(function(req, res, next) {
	var send = res.send.bind(res);
	res.send = function(content) {
		res.header('Access-Control-Allow-Origin', '*');
		if (typeof content === 'string') return send(content);
		if (!content.template) return send(content);
		if (!content.hasOwnProperty('data')) content.data = {};
		if (content.status == 'success' && !content.data.hasOwnProperty('status')) content.data.status = 'success';
		if (req.query.sessionId && res.locals.session && !content.data.hasOwnProperty('sessionId')) content.data.sessionId = req.query.sessionId;
		if (res.locals.session && !content.data.hasOwnProperty('session')) content.data.session = res.locals.session;
		console.log(content);

		content.lang = function(name, language) {
			if (!language) language = (!res.locals.session || !res.locals.session.language) ? defaultLanguage._id : res.locals.session.language;
			if (!variables.hasOwnProperty(language)) return name;
			if (!variables[language].hasOwnProperty(name)) return name;
			return variables[language][name];
		};

		if (content.errors) for (var i = 0; i < content.errors.length; ++i) content.errors[i] = content.lang(content.errors[i]);

		fs.readFile('./template/'+content.template+'.jade', function(err, tpl) {
			if (err) {
				console.log(err);
				return send('bambambam... error, sry pplz');
			}

			var fn = jade.compile(tpl, {filename: './template/'+content.template+'.jade'});
			var response = fn(content);
			send(response);
		});
	};
	next();
});

// handle sessionId field
app.all('*', function(req, res, callback) {
	if (!req.query.sessionId) return callback();

	Session.findOne({_id: req.query.sessionId})
		.exec(function(err, session) {
			if (err) return res.send(err);

			res.locals.session = session;
			callback();
		});
});

// add controllers to server
[
	'Home',
	'Language',
	'LanguageVariable',
	'Menu',
	'MenuItem',
	'Post',
	'User',
	'Usergroup'
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