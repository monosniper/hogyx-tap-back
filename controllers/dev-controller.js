const UserModel = require('../models/user-model');
const {servers} = require("../config");

class DevController {
    async setServers(req, res) {
        await UserModel.updateMany({}, { servers });

        return res.json('ok');
    }
}

module.exports = new DevController();