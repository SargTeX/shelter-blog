var db = require('mongoose');
var ObjectId = db.Schema.Types.ObjectId;

var Permission = new db.Schema({
	name: {type: String, unique: true, required: true}
});

module.exports = db.model('Permission', Permission);s