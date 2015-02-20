var respond = require('../tool/respond.js'),
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
};