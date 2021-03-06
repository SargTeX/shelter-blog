var db = require('mongoose');
var ObjectId = db.Schema.Types.ObjectId;

var Language = new db.Schema({
	name: {type: String, required: true, unique: true},
	code: {type: String, required: true, unique: true},
	default: {type: Boolean, required: true, default: false}
});

module.exports = db.model('Language', Language);