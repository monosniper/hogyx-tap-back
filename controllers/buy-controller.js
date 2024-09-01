const BuyService = require('../services/buy-service');

class BuyController {
	async energy(req, res, next) {
		try {
			await BuyService.energy(req.tg_id);

			return res.json('ok');
		} catch (e) {
			next(e);
		}
	}

	async tap(req, res, next) {
		try {
			await BuyService.tap(req.tg_id);

			return res.json('ok');
		} catch (e) {
			next(e);
		}
	}

	async hour(req, res, next) {
		try {
			await BuyService.hour(req.tg_id);

			return res.json('ok');
		} catch (e) {
			next(e);
		}
	}

	async detail(req, res, next) {
		try {
			const { server, detail } = req.body
			await BuyService.detail(req.tg_id, server, detail);

			return res.json('ok');
		} catch (e) {
			next(e);
		}
	}

	async server(req, res, next) {
		try {
			const { server } = req.body
			const rs = await BuyService.server(req.tg_id, server);

			return res.json(rs);
		} catch (e) {
			next(e);
		}
	}
}

module.exports = new BuyController();