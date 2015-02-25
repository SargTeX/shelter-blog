var async = require('async'),
	respond = require('../tool/respond.js'),
	Language = require('../model/Language.js');

exports.setup = function(app) {
	app.get('/LanguageList', function(req, res, jump) {
		Language.find()
			.sort('code')
			.exec(function(err, languages) {
				if (err) return jump(err);

				respond(req, res, {languages: languages});
			});
	});

	app.get('/LanguageAdd', function(req, res, jump) {
		var language = new Language({code: req.param('code')});
		language.name = 'language.data.name.'+language.code;
		var languageVariable = new LanguageVariable({name: language.name, language: req.param('languageId'), translation: req.param('name')});

		Language.findOne({code: req.param('code')})
			.exec(function(err, language) {
				if (err) return jump(err);
				if (language) return respond(req, res, null, 'error.language.code.exists');

				async.parallel([
					function(next) {language.save(next);},
					function(next) {languageVariable.save(next);}
				], function(err) {
					if (err) return jump(err);

					respond(req, res, {languageId: language._id});
				});
			});
	});
};