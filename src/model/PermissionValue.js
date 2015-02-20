var db = require('mongoose');
var ObjectId = db.Schema.Types.ObjectId;

var PermissionValue = new db.Schema({
	permission: {type: ObjectId, ref: 'Permission', required: true},
	usergroup: {type: ObjectId, ref: 'Usergroup', required: true},
	value: {type: Boolean, required: true}
});

PermissionValue.index({permission: 1, usergroup: 1});

module.exports = db.model('PermissionValue', PermissionValue);