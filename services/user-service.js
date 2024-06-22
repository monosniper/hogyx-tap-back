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
        let save = false

        if(!user) {
            user = await UserModel.create({tg_id, name, ref_code: makeid(24)})

            if(ref_code) {
                const ref_user = await UserModel.findOneAndUpdate({ ref_code }, {
                    $push: { friends: user._id },
                }, {new: true})

                ref_user.balance += 50000
                ref_user.save()

                user.balance += isPremium ? gifts.other.friend.premium : gifts.other.friend.non_premium
                save = true
            }
        } else {
            if(user.name !== name) {
                user.name = name
                save = true
            }
        }

        const diff = diff_hours(new Date(), user.last_day_gift)

        if(!user.last_day_gift || (diff >= 24 && diff < 48)) {
            user.last_day_gift = new Date()
            if(user.current_day === 7) user.current_day = 0
            const amount = gifts.days[user.current_day + 1]
            user.balance += amount
            user.current_day++
            save = true

            await NotificationService.store(user._id, 'day_gift', {amount, day: user.current_day})
        } else if (diff >= 48) {
            user.current_day = 1
            const amount = gifts.days[1]
            user.balance += amount
            user.last_day_gift = new Date()
            save = true

            await NotificationService.store(user._id, 'day_gift', {amount, day: 1})
        }

        // Offline income
        if(user.offline_income) {
            user.balance += user.offline_income

            await NotificationService.store(user._id, 'hour_income', {amount: user.offline_income})

            user.offline_income = 0
            user.start_offline_income = new Date()

            save = true
        }

        user.last_user_online = new Date()
        save && await user.save()

        return new UserDto(user)
    }

    async getLeaders() {
        const users = await UserModel.find({}).sort({experience: -1}).exec();

        return users.map(user => new UserDto(user));
    }

    async subscribed(tg_id) {
        const user = await UserModel.findOne({tg_id});
        user.balance += gifts.other.subscribed
        user.subscribed = true
        await user.save()
    }

    async buyEnergy(tg_id) {
        const user = await UserModel.findOne({tg_id})
        const next_level = shop.energy[user.energy_level+1]

        if(user.balance >= next_level.cost) {
            user.energy_level++
            user.max_energy += next_level.value
            user.energy = user.max_energy
            user.balance -= next_level.cost
            user.last_user_online = new Date()
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
            user.last_user_online = new Date()
            user.save()
        }
    }

    async buyHour(tg_id) {
        const user = await UserModel.findOne({tg_id})
        const next_level = shop.hour[user.hour_level+1]

        if(user.balance >= next_level.cost) {
            user.hour_level++
            user.hour_amount += next_level.value
            user.balance -= next_level.cost
            user.last_user_online = new Date()
            user.save()
        }
    }

    async siteVisited(hogyx_user_id) {
        const user = await UserModel.findOne({hogyx_user_id})

        if(user) {
            const diff = diff_hours(new Date(), user.last_site_visit)

            if(diff && diff > 24) {
                user.balance += gifts.other.site_visit
                user.last_site_visit = new Date()

                await user.save()
            }
        }
    }

    async accountLink(hogyx_user_id) {
        const user = await UserModel.findOne({hogyx_user_id})

        if(user && !(user?.hogyx_user_id)) {
            user.hogyx_user_id = hogyx_user_id
            await user.save()
        }
    }

    async energy(tg_id, count) {
        let user = await UserModel.findOne({tg_id})

        user.energy += count
        if(user.energy > user.max_energy) user.energy = user.max_energy

        user.last_user_online = new Date()
        await user.save()

        return new UserDto(user)
    }

    async update(tg_id, data) {
        let user = await UserModel.updateOne({tg_id}, data, {new: true})

        return new UserDto(user)
    }

    async taps(tg_id, taps) {
        let user = await UserModel.findOne({tg_id})

        const amount = taps * user.tap_amount

        user.taps_count += taps
        user.balance += amount
        user.balance_by_day += amount
        user.experience += amount
        user.energy -= taps
        user.last_user_online = new Date()

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