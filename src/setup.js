var async = require('async'),
	db = require('mongoose'),
	fs = require('fs'),
	Language = require('./model/Language.js'),
	LanguageVariable = require('./model/LanguageVariable.js');

async.parallel([
	function(next) {
		fs.readFile('./config/languageVariables.txt', function(err, content) {
			if (err) return next(err);

			var entries = content.toString().split('\n');
			var languages = {};

			// create language variables
			async.each(entries, function(entry, next2) {
				var items = entry.split('\t');
				for (var i = 0; i < items.length; ++i) items[i] = items[i].trim();
				if (!languages.hasOwnProperty(items[1])) languages[items[1]] = new Language({
					code: items[1],
					name: 'language.'+items[1]
				});
				var variable = new LanguageVariable({
					name: items[0],
					language: languages[items[1]]._id,
					translation: ''
				});
				for (var i = 2; i < items.length; ++i) {
					if (variable.translation) variable.translation += '\t';
					variable.translation += items[i];
				}
				variable.save(next2);
			}, function(err) {
				if (err) return next(err);

				// create languages
				async.each(Object.keys(languages), function(name, next2) {
					languages[name].save(next2);
				}, next);
			});
		});
	}
], function(err) {
	if (err) throw err;
	console.log('finished setup');
});