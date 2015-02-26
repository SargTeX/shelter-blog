var async = require('async'),
	Language = require('../model/Language.js'),
	LanguageVariable = require('../model/LanguageVariable.js');

exports.setup = function(app) {
	app.get('/LanguageVariableTranslate', function(req, res, jump) {
		Language.find({})
			.exec(function(err, languages) {
				if (err) return jump(err);

				res.send({template: 'LanguageVariableTranslate', data: {languages: languages, name: req.query.name}});
			});
	});

	app.post('/LanguageVariableTranslate', function(req, res, jump) {
		var languages = [],
			variable = null;

		async.parallel([
			function(next) {
				LanguageVariable.findOne({name: req.body.name, language: req.body.languageId})
					.exec(function(err, item) {
						if (err) return next(err);
						variable = item;
						next();
					});
			},
			function(next) {
				Language.find({})
					.exec(function(err, items) {
						if (err) return next(err);
						languages = items;
						next();
					});
			}
		], function(err) {
			if (err) return jump(err);

			if (!variable) variable = new LanguageVariable({name: req.body.name, language: req.body.languageId, translation: req.body.translation});
			else variable.translation = req.body.translation;
			variable.save(function(err) {
				if (err) return jump(err);

				res.send({status: 'success', template: 'LanguageVariableTranslate', data: {languages: languages, name: req.body.name}});
			});
		});
	});
}