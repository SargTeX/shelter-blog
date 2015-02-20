module.exports = function(req, res, data, errors) {
	var response = {status: 'success'};
	if (typeof errors === 'string') errors = [errors];
	if (errors) {
		response.status = 'error';
		response.errors = errors;
	}
	if (data) response.data = data;
	res.send(response);
};