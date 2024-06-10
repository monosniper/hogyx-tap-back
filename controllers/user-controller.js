const UserService = require('../services/user-service');
const NotificationService = require('../services/notification-service');

class UserController {
    async login(req, res, next) {
        try {
            const {name} = req.body;
            const userData = await UserService.login(req.tg_id, name);

            // await NotificationService.store(userData.id, 'day_gift', {day: 2, amount: 1000})

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async taps(req, res, next) {
        try {
            const {count} = req.body;
            const userData = await UserService.taps(req.tg_id, count);

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getLeaders(req, res, next) {
        try {
            const leaders = await UserService.getLeaders();

            return res.json(leaders);
        } catch (e) {
            next(e);
        }
    }

    async channelWebhook(req, res, next) {
        try {
            console.log(req.body)

            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();