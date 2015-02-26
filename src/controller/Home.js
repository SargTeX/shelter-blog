var User = require('../model/User.js');

exports.setup = function(app) {
	app.get('/', function(req, res, jump) {res.send({template: 'Home'})});
	app.get('/Home', function(req, res, jump) {res.send({template: 'Home'})});

	app.get('/UserHome', function(req, res, jump) {
		User.findById(res.locals.session.user)
			.exec(function(err, user) {
				if (err) return jump(err);
				if (!user) return res.send({status: 'error', template: 'PermissionError', errors: ['Du musst angemeldet sein.']});

				res.send({template: 'UserHome', data: {user: user}});
			});
	});
}