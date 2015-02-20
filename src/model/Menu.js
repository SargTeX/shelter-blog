var db = require('mongoose');
var ObjectId = db.Schema.Types.ObjectId;

var Menu = new db.Schema({
	code: {type: String, required: true, unique: true},
	title: {type: String, required: true}
});

module.exports = db.model('Menu', Menu);