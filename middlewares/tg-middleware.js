const ApiError = require('../exceptions/api-error');

module.exports = function (req, res, next) {
	try {
		const authorizationHeader = req.headers.Tg_id;
		if (!authorizationHeader) {
			return next(ApiError.UnauthorizedError());
		}

		req.tg_id = authorizationHeader;
		next();
	} catch (e) {
		return next(ApiError.UnauthorizedError());
	}
}