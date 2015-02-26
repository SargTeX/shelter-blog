var async = require('async'),
	respond = require('../tool/respond.js'),
	LanguageVariable = require('../model/LanguageVariable.js'),
	Usergroup = require('../model/Usergroup.js');

exports.setup = function(app) {
	app.get('/UsergroupAdd', function(req, res, jump) {res.send({template: 'UsergroupAdd'})});
	app.get('/UsergroupList', function(req, res, jump) {
		Usergroup.find({})
			.exec(function(err, groups) {
				if (err) return jump(err);

				var response = {template: 'UsergroupList', data: {usergroups: groups}};
				if (req.query.success) {
					response.data.success = req.query.success;
					response.status = 'success';
				}
				res.send(response);
			});
	});

	app.post('/UsergroupAdd', function(req, res, jump) {
		var usergroup = new Usergroup({name: 'usergroup.data.name.'+(req.param('code') ? req.param('code') : '')});
		if (!req.param('code')) usergroup.name += usergroup._id;
		var languageVariable = new LanguageVariable({name: usergroup.name, language: res.locals.session.language, translation: req.param('name')});

		Usergroup.findOne({name: usergroup.name})
			.exec(function(err, group) {
				if (err) return jump(err);
				if (group) return res.send({status: 'error', template: 'UsergroupAdd', errors: ['error.usergroup.name.exists']});

				async.parallel([
					function(next) {usergroup.save(next);},
					function(next) {languageVariable.save(next);}
				], function(err) {
					if (err) return jump(err);

					res.send({template: 'UsergroupAdd', status: 'success', data: {usergroup: usergroup}});
				});
			});
	});

	app.post('/UsergroupTranslate', function(req, res, jump) {
		Usergroup.findById(req.param('usergroupId'))
			.exec(function(err, group) {
				if (err) return jump(err);
				if (!group) return res.send({status: 'error', template: 'UsergroupTranslate', errors: ['error.usergroup.unknown']});

				LanguageVariable.findOne({name: group.name, language: req.param('languageId')})
					.exec(function(err, variable) {
						if (err) return jump(err);

						if (variable) variable.translation = req.param('name');
						else variable = new LanguageVariable({name: group.name, language: req.param('languageId')});

						variable.save(function(err) {
							if (err) return jump(err);

							respond(req, res);
						});
					});
			});
	});

	app.get('/UsergroupDelete', function(req, res, jump) {
		Usergroup.findById(req.query.usergroupId)
			.exec(function(err, usergroup) {
				if (err) return jump(err);
				if (!usergroup) {
					res.writeHead(302, {'Location': '/UsergroupList?sessionId='+res.locals.session._id+'&success=delete'});
					return res.end();
				}

				usergroup.remove(function(err) {
					if (err) return jump(err);
					res.writeHead(302, {'Location': '/UsergroupList?sessionId='+res.locals.session._id+'&success=delete'});
					res.end();
				});
			});
	});
}