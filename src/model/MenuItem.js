var db = require('mongoose');
var ObjectId = db.Schema.Types.ObjectId;

var MenuItem = new db.Schema({
	menu: {type: ObjectId, ref: 'Menu', required: true},
	position: {type: Number, required: true},
	title: {type: String, required: true}, // can as always contain a language var
	target: {type: String, required: true}
});

MenuItem.index({menu: 1, position: 1});

module.exports = db.model('MenuItem', MenuItem);