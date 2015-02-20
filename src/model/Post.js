var db = require('mongoose');
var ObjectId = db.Schema.Types.ObjectId;

var Post = new db.Schema({
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: {type: ObjectId, ref: 'User'},
	time: {type: Date, default: Date.now, required: true},
	parent: {type: ObjectId, ref: 'Post'},
	language: {type: ObjectId, ref: 'Language'}
});

module.exports = db.model('Post', Post);