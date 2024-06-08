const ApiError = require('../exceptions/api-error');

module.exports = function (req, res, next) {
	console.log(req.get("tg_id"))
	console.log(req.get("Tg_id"))
	console.log(req.headers.Tg_id)
	console.log(req.headers.tg_id)
	console.log(req.headers)
	try {
		const authorizationHeader = req.get("tg_id");
		if (!authorizationHeader) {
			return next(ApiError.UnauthorizedError());
		}

		req.tg_id = authorizationHeader;
		next();
	} catch (e) {
		return next(ApiError.UnauthorizedError());
	}
}