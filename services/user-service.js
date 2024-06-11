require('dotenv').config();
const UserModel = require('../models/user-model');
const UserDto = require('../dtos/user-dto');
const makeid = require("../helpers/makeId");
const {levels, shop, gifts} = require("../config");
const diff_hours = require("../helpers/diffHours");
const NotificationService = require('../services/notification-service');

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
                user.save()
            }
        } else {
            if(user.name !== name) {
                user.name = name
                await user.save()
            }
        }

        const diff = diff_hours(new Date(), user.last_day_gift)

        if(!user.last_day_gift || (diff >= 24 && diff < 48)) {
            user.last_day_gift = new Date()
            if(user.current_day === 7) user.current_day = 0
            const amount = gifts[user.current_day + 1]
            user.balance += amount
            user.current_day++
            user.save()

            await NotificationService.store(user._id, 'day_gift', {amount, day: user.current_day})
        } else if (diff >= 48) {
            user.current_day = 1
            const amount = gifts[1]
            user.balance += amount
            user.last_day_gift = new Date()
            user.save()

            await NotificationService.store(user._id, 'day_gift', {amount, day: 1})
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
            user.energy = user.max_energy
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
        user.energy -= taps

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