var async = require('async'),
	config = require('./config/config.js'),
	db = require('mongoose'),
	fs = require('fs'),
	Language = require('./model/Language.js'),
	LanguageVariable = require('./model/LanguageVariable.js');

var permissions = [
	'menu.canAdd', 'menu.canTranslate', 'menuItem.canAdd', 'menuItem.canTranslate',
	'post.canAdd', 'post.canTranslate'
];

db.connect('mongodb://'+config.db.IP+':'+config.db.PORT+'/'+config.db.NAME);

async.parallel([
	function(next) {
		LanguageVariable.remove({}, {multi: true})
			.exec(function(err) {
				if (err) return next(err);

				Language.find({})
					.exec(function(err, items) {
						if (err) return next(err);

						var languages = {};
						for (var i = 0; i < items.length; ++i) languages[items[i].code] = items[i]._id;
						console.log(languages);

						fs.readFile('./config/languageVariables.txt', function(err, content) {
							if (err) return next(err);

							var entries = content.toString().split('\n');

							// create language variables
							async.each(entries, function(entry, next2) {
								var items = entry.split('\t'),
									language = null;
								for (var i = 0; i < items.length; ++i) items[i] = items[i].trim();
								if (!languages[items[0]]) {
									language = new Language({
										code: items[0],
										name: 'language.data.name.'+items[0]
									});
									languages[items[0]] = language._id;
								}
								var variable = new LanguageVariable({
									name: items[1],
									language: languages[items[0]],
									translation: ''
								});
								for (var i = 2; i < items.length; ++i) {
									if (variable.translation) variable.translation += '\t';
									variable.translation += items[i];
								}
								async.parallel([
									function(next3) {variable.save(next3);},
									function(next3) {
										if (!language) return next3();
										console.log(language);
										language.save(next3);
									}
								], next2);
							}, next);
						});
					});
			});
	}
], function(err) {
	if (err) throw err;
	console.log('finished setup');
});