var bcrypt = require('bcrypt'),
	config = require('../config/config.js'),
	db = require('mongoose');
var ObjectId = db.Schema.Types.ObjectId;

var User = new db.Schema({
	username: {type: String, unique: true, required: true},
	password: {type: String, required: true, minlength: 8},
	email: {type: String},
	usergroups: [{type: ObjectId, ref: 'Usergroup'}],
	settings: {
		language: {type: ObjectId, ref: 'Language'}
	}
});

User.pre('save', function(callback) {
	var user = this;

	// verschlüssele das Passwort nur, wenn es geändert wurde
	if (!user.isModified('password')) return callback();

	// generiere SALT
	bcrypt.genSalt(config.PASSWORD_SALT_WORK_FACTOR, function (err, salt) {
		if (err) return callback(err);

		// verschlüssele das Passwort
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return callback(err);

			// überschreibe Passwort mit Verschlüsselung
			user.password = hash;
			callback();
		});
	});
});
User.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};

User.methods.hasPermission = function(permission, callback) {
	Permission.findOne({name: permission})
		.exec(function(err, item) {
			if (err) return callback(err);
			if (!item) return callback('permission.unknown');

			PermissionValue.find({permission: item._id, usergroup: {$in: this.usergroups}})
				.exec(function(err, values) {
					if (err) return callback(err);

					for (var i = 0; i < values.length; ++i) if (values[i].value) return callback(false, true);
					callback(false, false);
				});
		});
};

module.exports = db.model('User', User);