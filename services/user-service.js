require('dotenv').config();
const UserModel = require('../models/user-model');
const UserDto = require('../dtos/user-dto');
const makeid = require("../helpers/makeId");

class UserService {
    async login(tg_id, name) {
        let user = await UserModel.findOne({tg_id})

        if(!user) {
            const ref_code = makeid(24)

            user = await UserModel.create({tg_id, name, ref_code})
        } else {
            if(user.name !== name) {
                user.name = name
                await user.save()
            }
        }

        return new UserDto(user)
    }

    async taps(tg_id, taps) {
        let user = await UserModel.findOne({tg_id})

        user.taps_count += taps
        user.balance += taps * user.tap_amount
        user.energy -= taps

        await user.save()

        return new UserDto(user)
    }
}


module.exports = new UserService();