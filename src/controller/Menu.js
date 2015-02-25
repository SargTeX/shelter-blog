var respond = require('../tool/respond.js'),
	LanguageVariable = require('../model/LanguageVariable.js'),
	Menu = require('../model/Menu.js');

exports.setup = function(app) {
	app.get('/MenuList', function(req, res, jump) {
		Menu.find()
			.sort('code')
			.exec(function(err, menus) {
				if (err) return jump(err);

				respond(req, res, {menus: menus});
			});
	});

	app.post('/MenuAdd', function(req, res, jump) {
		res.locals.session.user.hasPermission('menu.canAdd', function(err, has) {
			if (err) return jump(err);
			if (!has) return respond(req, res, null, 'error.permission.menu.canAdd');

			var menu = new Menu({
				code: req.param('code')
			});
			menu.title = 'menu.data.title.'+menu._id;

			var variable = new LanguageVariable({
				name: 'menu.data.title.'+menu._id,
				language: req.param('languageId'),
				translation: req.param('title')
			});

			async.parallel([
				function(next) {menu.save(next);},
				function(next) {variable.save(next);}
			], function(err) {
				if (err) return jump(err);

				respond(req, res);
			});
		});
	});

	app.post('/MenuTranslate', function(req, res, jump) {
		res.locals.session.user.hasPermission('menu.canTranslate', function(err, has) {
			if (err) return jump(err);
			if (!has) return respond(req, res, null, 'error.permission.menu.canTranslate');
			LanguageVariable.findOne({name: 'menu.data.title.'+req.param('menuId'), language: req.param('languageId')})
				.exec(function(err, variable) {
					if (err) return jump(err);

					if (variable) variable.translation = req.param('title');
					else variable = new LanguageVariable({
						name: 'menu.data.title.'+req.param('menuId'),
						language: req.param('languageId'),
						translation: req.param('title')
					});

					variable.save(function(err) {
						if (err) return jump(err);

						respond(req, res);
					});
				});
		});
	});
};