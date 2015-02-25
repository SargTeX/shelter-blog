var respond = require('../tool/respond.js'),
	LanguageVariable = require('../model/LanguageVariable.js'),
	MenuItem = require('../model/MenuItem.js');

exports.setup = function(app) {
	app.get('/MenuItemList', function(req, res, jump) {
		MenuItem.find({menu: req.param('menuId')})
			.sort('position')
			.exec(function(err, items) {
				if (err) return jump(err);

				respond(req, res, {items: items});
			});
	});

	app.post('/MenuItemAdd', function(req, res, jump) {
		res.locals.session.user.hasPermission('menuItem.canAdd', function(err, has) {
			if (err) return jump(err);
			if (!has) return respond(req, res, null, 'error.permission.menuItem.canAdd');

			var item = new MenuItem({
				menu: req.param('menuId'),
				target: req.param('title'),
				position: req.param('position')
			});
			item.title = 'menu.item.data.title.'+item._id;
			var variable = new LanguageVariable({
				name: 'menu.item.data.title.'+item._id,
				language: req.param('languageId'),
				translation: req.param('title')
			});

			MenuItem.update({position: {$gte: item.position}}, {position: {$inc: 1}}, {multi: true})
				.exec(function(err) {
					if (err) return jump(err);

					async.parallel([
						function(next) {variable.save(next);},
						function(next) {item.save(next);}
					], function(err) {
						if (err) return jump(err);

						respond(req, res);
					});
				});
		});
	});

	app.post('/MenuItemTranslate', function(req, res, jump) {
		res.locals.session.user.hasPermission('menuItem.canTranslate', function(err, has) {
			if (err) return jump(err);
			if (!has) return respond(req, res, null, 'error.permission.menuItem.canTranslate');

			LanguageVariable.findOne({name: 'menu.item.data.title.'+req.param('itemId'), language: req.param('languageId')})
				.exec(function(err, variable) {
					if (err) return jump(err);

					if (variable) variable.translation = req.param('title');
					else variable = new LanguageVariable({
						name: 'menu.item.data.title'+req.param('itemId'),
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