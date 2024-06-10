require('dotenv').config();
const UserModel = require('../models/user-model');
const UserDto = require('../dtos/user-dto');
const makeid = require("../helpers/makeId");
const {levels, shop} = require("../config");

class UserService {
    async login(tg_id, name, ref_code, isPremium) {
        let user = await UserModel.findOne({tg_id}).populate('friends')

        if(!user) {
            user = await UserModel.create({tg_id, name, ref_code: makeid(24)})

            if(ref_code) {
                const ref_user = await UserModel.findOneAndUpdate({ ref_code }, {
                    $push: { friends: user._id },
                }, {new: true})

                ref_user.balance += 50000
                ref_user.save()

                user.balance += isPremium ? 150000 : 50000
            }
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

    async buyEnergy(tg_id) {
        const user = await UserModel.findOne({tg_id})
        const next_level = shop.energy[user.energy_level+1]

        if(user.balance >= next_level.cost) {
            user.energy_level++
            user.max_energy += next_level.value
            user.balance -= next_level.cost
            user.save()
        }
    }

    async buyTap(tg_id) {
        const user = await UserModel.findOne({tg_id})
        const next_level = shop.tap[user.tap_level+1]

        if(user.balance >= next_level.cost) {
            user.tap_level++
            user.tap_amount += next_level.value
            user.balance -= next_level.cost
            user.save()
        }
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