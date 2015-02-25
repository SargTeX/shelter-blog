var async = require('async'),
	respond = require('../tool/respond.js'),
	Usergroup = require('../model/Usergroup.js');

exports.setup = function(app) {
	app.get('/UsergroupList', function(req, res, jump) {
		Usergroup.find({})
			.exec(function(err, groups) {
				if (err) return jump(err);

				respond(req, res, {groups: groups});
			});
	});

	app.get('/UsergroupAdd', function(req, res, jump) {
		var usergroup = new Usergroup({name: 'usergroup.data.name.'+req.param('code') ? req.param('code') : ''});
		if (!req.param('code')) usergroup.name += usergroup._id;
		var languageVariable = new LanguageVariable({name: usergroup.name, language: req.param('languageId')});

		Usergroup.find({name: usergroup.name})
			.exec(function(err, group) {
				if (err) return jump(err);
				if (group) return respond(req, res, null, 'error.usergroup.name.exists');

				async.parallel([
					function(next) {usergroup.save(next);},
					function(next) {languageVariable.save(next);}
				], function(err) {
					if (err) return jump(err);
					respond(req, res);
				});
			});
	});

	app.get('/UsergroupTranslate', function(req, res, jump) {
		Usergroup.findById(req.param('usergroupId'))
			.exec(function(err, group) {
				if (err) return jump(err);
				if (!group) return respond(req, res, null, 'error.usergroup.unknown');

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
}