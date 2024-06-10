const NotificationService = require('../services/notification-service');

class NotificationController {
	async getUnread(req, res, next) {
		try {
			const notifications = await NotificationService.getUnread(req.tg_id);

			return res.json(notifications);
		} catch (e) {
			next(e);
		}
	}

	async makeRead(req, res, next) {
		try {
			const {id} = req.params;
			await NotificationService.makeRead(id);

			return res.json('ok');
		} catch (e) {
			next(e);
		}
	}
}

module.exports = new NotificationController();