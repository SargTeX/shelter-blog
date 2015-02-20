var db = require('mongoose');
var ObjectId = db.Schema.Types.ObjectId;

var LanguageVariable = new db.Schema({
	name: {type: String, required: true},
	language: {type: ObjectId, required: true, ref: 'Language'},
	translation: {type: String, required: true}
});

LanguageVariable.index({name: 1, language: 1});

module.exports = db.model('LanguageVariable', LanguageVariable);