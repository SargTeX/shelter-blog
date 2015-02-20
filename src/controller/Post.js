var respond = require('../tool/respond.js');

exports.setup = function(app) {
	app.post('/PostAdd', function(req, res, jump) {
		res.locals.session.user.hasPermission('post.canAdd', function(err, has) {
			if (err) return jump(err);
			if (!has) return respond(req, res, null, 'error.permission.post.canAdd');

			var post = new Post({
				user: res.locals.session.user._id
			});
			post.title = 'post.data.title.'+post._id;
			post.content = 'post.data.content.'+post._id;

			Language.findOne({code: req.param('languageCode')})
				.exec(function(err, language) {
					if (err) return jump(err);
					if (!language) return respond(req, res, null, 'error.language.unknown');

					var variables = [
						new LanguageVariable({
							name: 'post.data.title.'+post._id,
							language: language.code,
							translation: req.param('title')
						}),
						new LanguageVariable({
							name: 'post.data.content.'+post._id,
							language: language.code,
							translation: req.param('content')
						})
					];

					async.parallel([
						function(next) {
							async.each(variables, function(variable, next2) {
								variable.save(next2);
							}, next);
						},

						function(next) {
							post.save(next);
						}
					], function(err) {
						if (err) return jump(err);

						respond(req, res);
					});
				});
		});
	});
};