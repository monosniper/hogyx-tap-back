const UserService = require('../services/user-service');
const NotificationService = require('../services/notification-service');

class UserController {
    async login(req, res, next) {
        try {
            const {name, ref_code, isPremium} = req.body;
            const userData = await UserService.login(req.tg_id, name, ref_code, isPremium);

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

    async buyEnergy(req, res, next) {
        try {
            await UserService.buyEnergy(req.tg_id);

            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }

    async buyTap(req, res, next) {
        try {
            await UserService.buyTap(req.tg_id);

            return res.json('ok');
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
            const { chat_member: { chat: { id: chat_id }, from: { id: user_id }, new_chat_member: { status } } } = req.body

            if(chat_id.toString() === (process.env.CHANNEL_ID).toString() && status === 'member') {
                await UserService.subscribed(user_id)
            }

            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();