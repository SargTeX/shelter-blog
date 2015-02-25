var respond = require('../tool/respond.js');

exports.setup = function(app) {
	app.get('/PostAdd', function(req, res, jump) {
		res.locals.session.user.hasPermission('post.canAdd', function(err, has) {
			if (err) return jump(err);
			if (!has) return respond(req, res, null, 'error.permission.post.canAdd');

			var post = new Post({
				user: res.locals.session.user._id
			});
			post.title = 'post.data.title.'+post._id;
			post.content = 'post.data.content.'+post._id;

			var variables = [
				new LanguageVariable({
					name: 'post.data.title.'+post._id,
					language: req.param('languageCode'),
					translation: req.param('title')
				}),
				new LanguageVariable({
					name: 'post.data.content.'+post._id,
					language: req.param('languageCode'),
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


	app.get('/PostList', function(req, res, jump) {
		var query = {};
		if (req.param('parent')) query.parent = req.param('parent');
		
		Post.find(query)
			.sort('-time')
			.skip(req.param('offset') || 20)
			.limit(req.param('amount') || 20)
			.exec(function(err, posts) {
				if (err) return jump(err);

				respond(req, res, {posts: posts});
			});
	});


	app.get('/PostTranslate', function(req, res, jump) {
		res.locals.session.user.hasPermission('post.canTranslate', function(err, has) {
			if (err) return jump(err);
			if (!has) return respond(req, res, null, 'error.permission.post.canTranslate');

			var variables = [
				new LanguageVariable({
					name: 'post.data.title.'+req.param('postId'),
					language: req.param('languageId'),
					translation: req.param('title')
				}),
				new LanguageVariable({
					name: 'post.data.content.'+req.param('postId'),
					language: req.param('languageId'),
					translation: req.param('content')
				})
			];
			async.each(variables, function(variable, next) {
				variable.save(next);
			}, function(err) {
				if (err) return jump(err);

				respond(req, res);
			});
		});
	});
};