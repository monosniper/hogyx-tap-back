require('dotenv').config();
const UserModel = require('../models/user-model');
const UserDto = require('../dtos/user-dto');
const makeid = require("../helpers/makeId");
const {levels} = require("../config");

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

    async getLeaders() {
        const users = await UserModel.find({}).sort({experience: -1}).exec();

        return users.map(user => new UserDto(user));
    }

    async subscribed(id) {
        return UserModel.updateOne({_id: id}, {subscribed: true});
    }

    async taps(tg_id, taps) {
        let user = await UserModel.findOne({tg_id})

        const amount = taps * user.tap_amount

        user.taps_count += taps
        user.balance += amount
        user.experience += amount
        user.energy--

        if(user.experience >= levels[user.skill_level+1].value) {
            user.skill_level++
            user.max_energy += levels[user.skill_level].add_energy
            user.energy = user.max_energy
        }

        await user.save()

        return new UserDto(user)
    }
}


module.exports = new UserService();