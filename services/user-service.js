require('dotenv').config();
const UserModel = require('../models/user-model');
const UserDto = require('../dtos/user-dto');
const makeid = require("../helpers/makeId");
const {levels, shop, gifts} = require("../config");
const diff_hours = require("../helpers/diffHours");
const NotificationService = require('../services/notification-service');
const bot = require("../bot");
const lang = require("../lang");

class UserService {
    async login(tg_id, name, ref_code=false, isPremium=false, language_code='ru') {
        let user = await UserModel.findOne({tg_id}).populate('friends')

        if(!user) {
            user = await UserModel.create({tg_id, name, ref_code: makeid(24)})

            if(ref_code) {
                const ref_user = await UserModel.findOneAndUpdate({ ref_code }, {
                    $push: { friends: user._id },
                }, {new: true})

                ref_user.balance += 50000
                ref_user.save()

                user.balance += isPremium ? gifts.friend.prem.value : gifts.friend.no_prem.value
                await bot.sendMessage(ref_user.tg_id, lang(ref_user.language_code).new_ref(user.name), {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{text: '🕹️ Начать игру', web_app: {url: 'https://hogyx-tap-front.vercel.app'}}],
                        ]
                    })
                });
            }
        } else {
            if(user.name !== name || user.language_code !== language_code) {
                user.name = name
                user.language_code = language_code
            }
        }

        const diff = diff_hours(new Date(), user.last_day_gift)

        if(!user.last_day_gift || (diff >= 24 && diff < 48)) {
            user.last_day_gift = new Date()
            if(user.current_day === 7) user.current_day = 0
            const amount = gifts.days[user.current_day + 1].value
            user.balance += amount
            user.current_day++

            await NotificationService.store(user._id, 'day_gift', {amount, day: user.current_day})
        } else if (diff >= 48) {
            user.current_day = 1
            const amount = gifts.days[1].value
            user.balance += amount
            user.last_day_gift = new Date()

            await NotificationService.store(user._id, 'day_gift', {amount, day: 1})
        }

        // Offline income
        if(user.offline_income) {
            user.balance += user.offline_income

            await NotificationService.store(user._id, 'hour_income', {amount: user.offline_income})

            user.offline_income = 0
        }

        user.start_offline_income = new Date()
        user.last_user_online = new Date()
        await user.save()

        return new UserDto(user)
    }

    async getLeaders() {
        const users = await UserModel.find({}).sort({experience: -1}).exec();

        return users.map(user => new UserDto(user));
    }

    async subscribed(tg_id) {
        const user = await UserModel.findOne({tg_id});
        user.balance += gifts.subscribe.tg.value
        user.xbalance += gifts.subscribe.tg.xvalue
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

            if(diff > 24 || !user.last_site_visit) {
                user.balance += gifts.site_visit.value
                user.xbalance += gifts.site_visit.xvalue
                user.last_site_visit = new Date()

                await user.save()
            }
        }
    }

    async accountLink(hogyx_user_id, id) {
        const user = await UserModel.findById(id)
        console.log(user, user?.hogyx_user_id, id)
        if(user && !(user?.hogyx_user_id)) {
            user.hogyx_user_id = hogyx_user_id
            await user.save()
        }
    }

    async energy(tg_id, count) {
        let user = await UserModel.findOne({tg_id}).populate('friends')

        user.energy += count
        if(user.energy > user.max_energy) user.energy = user.max_energy

        user.last_user_online = new Date()
        await user.save()

        return new UserDto(user)
    }

    async me(tg_id) {
        let user = await UserModel.findOne({tg_id}).populate('friends')

        return new UserDto(user)
    }

    async update(tg_id, data) {
        let user = await UserModel.findOneAndUpdate({tg_id}, data, {new: true})

        return new UserDto(user.populate('friends'))
    }

    async taps(tg_id, taps) {
        let user = await UserModel.findOne({tg_id}).populate('friends')

        const amount = taps * user.tap_amount

        user.taps_count += taps
        user.balance += amount
        user.balance_by_day += amount
        user.experience += amount
        user.energy -= taps
        user.last_user_online = new Date()

        const nextLevel = levels[user.skill_level+1]

        if(nextLevel && user.experience >= nextLevel.value) {
            user.skill_level++
            user.max_energy += nextLevel.add_energy
            user.energy = user.max_energy
        }

        await user.save()

        return new UserDto(user)
    }
}


module.exports = new UserService();