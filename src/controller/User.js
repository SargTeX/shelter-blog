var async = require('async'),
	respond = require('../tool/respond.js'),
	Session = require('../model/Session.js'),
	User = require('../model/User.js');

exports.setup = function(app) {
	app.get('/UserLogin', function(req, res, jump) {
		res.send({template: 'UserLogin'});
	});
	app.get('/UserAdd', function(req, res, jump) {res.send({template: 'UserAdd'})});

	app.post('/UserLogin', function(req, res, jump) {
		User.findOne({username: req.param('username')})
			.exec(function(err, user) {
				if (err) return jump(err);
				//if (!user) return respond(req, res, null, 'error.userLogin.fail');
				if (!user) return res.send({status: 'error', template: 'UserLogin', errors: ['error.userLogin.fail']});

				user.comparePassword(req.param('password'), function(err, isMatch) {
					if (err) return jump(err);
					if (!isMatch) return res.send({status: 'error', template: 'UserLogin', errors: ['error.userLogin.fail']});
					//if (!isMatch) return respond(req, res, null, 'error.userLogin.fail');

					var session = new Session({
						user: user._id,
						language: user.settings.language
					});
					session.save(function(err) {
						if (err) return jump(err);

						res.writeHead(302, {'Location': '/UserHome?sessionId='+session._id});
						res.end();
					});
				});
			});
	});

	app.post('/UserAdd', function(req, res, jump) {
		User.findOne({username: req.param('username')})
			.exec(function(err, user) {
				if (err) return jump(err);
				if (user) return res.send({status: 'error', template: 'UserAdd', errors: ['error.user.username.exists']});
				//if (user) return respond(req, res, false, 'error.user.username.exists');

				var user = new User({
					username: req.param('username'),
					password: req.param('password')
				});
				var session = new Session({
					user: user._id
				});
				async.parallel([
					function(next) {user.save(next);},

					function(next) {session.save(next);}
				], function(err) {
					if (err) return jump(err);

					res.writeHead(302, {'Location': '/UserHome?sessionId='+session._id});
					res.end();
					//respond(req, res, {sessionId: session._id});
				});
			});
	});
};