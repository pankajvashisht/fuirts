const Apiresponse = (fn) => async (req, res) => {
	try {
		const { data = [], message, status = 200 } = await fn(req, res);
		res.status(status).send({
			success: true,
			code: status,
			message: message,
			data,
		});
	} catch (err) {
		return error(res, err);
	}
};

const error = (res, err) => {
	console.log('Errors is here');
	try {
		let code =
			typeof err === 'object'
				? err.hasOwnProperty('code')
					? err.code
					: 500
				: 403;
		let message =
			typeof err === 'object'
				? err.hasOwnProperty('message')
					? err.message
					: err
				: err;
		res.status(code).json({
			success: false,
			error_message: message,
			code: code,
			data: [],
		});
	} catch (error) {
		res.status(500).json(error);
	}
};
module.exports = Apiresponse;
