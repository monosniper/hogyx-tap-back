const UserService = require('../services/user-service');

class UserController {
    async login(req, res, next) {
        try {
            const {name} = req.body;
            const userData = await UserService.login(req.tg_id, name);

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
}

module.exports = new UserController();