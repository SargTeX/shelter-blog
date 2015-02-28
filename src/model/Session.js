var db = require('mongoose');
var ObjectId = db.Schema.Types.ObjectId;

var Session = new db.Schema({
	user: {type: ObjectId, ref: 'User'},
	language: {type: ObjectId, ref: 'Language'},
	time: {type: Date, default: Date.now, required: true}
});

module.exports = db.model('Session', Session);