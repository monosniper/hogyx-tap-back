const UserService = require('../services/user-service');
const bot = require("../bot");
const lang = require("../lang");



const video_file_id = "BAACAgIAAxkDAAIBNGZ3GfP8EZZye4tkF3Y28uoYZkocAAIoVQACiHi5S9Syx8_ngkBHNQQ"

class UserController {
    async login(req, res, next) {
        try {1
            const {name, ref_code, isPremium, language_code} = req.body;
            const userData = await UserService.login(req.tg_id, name, ref_code, isPremium, language_code);

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

    async energy(req, res, next) {
        try {
            const {count} = req.body;
            const userData = await UserService.energy(req.tg_id, count);

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const userData = await UserService.update(req.tg_id, req.body);

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async me(req, res, next) {
        try {
            const userData = await UserService.me(req.tg_id);

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

    async buyHour(req, res, next) {
        try {
            await UserService.buyHour(req.tg_id);

            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }

    async buyDetail(req, res, next) {
        try {
            const { server, detail } = req.body
            await UserService.buyDetail(req.tg_id, server, detail);

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

    async siteVisited(req, res, next) {
        try {
            const { hogyx_user_id } = req.body
            await UserService.siteVisited(hogyx_user_id);

            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }

    async accountLink(req, res, next) {
        try {
            const { hogyx_user_id, connect } = req.body
            await UserService.accountLink(hogyx_user_id, connect);

            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }

    static async chat_member(data) {
        const {
            chat: { id: chat_id },
            from: { id: user_tg_id },
            new_chat_member
        } = data

        if(new_chat_member) {
            const { status } = new_chat_member

            console.log('status', status, user_tg_id)

            if(chat_id.toString() === (process.env.CHANNEL_ID).toString() && status === 'member') {
                await UserService.subscribed(user_tg_id)
            }
        }
    }

    async successful_payment(id, server_name) {
        await UserService.giveServer(id, server_name)
    }

    static async message(data) {
        const { text, chat: { id, first_name }, from: { language_code, isPremium }, successful_payment } = data

        if(successful_payment) await UserController.successful_payment(id, successful_payment.invoice_payload)
        else {
            if(text === '/start') {
                const user = await UserService.login(id, first_name, false, isPremium, language_code)
                try {
                    await bot.sendVideo(id, video_file_id, {
                        caption: lang(language_code).start(user.ref_code),
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [{text: '🕹️ Начать игру', web_app: {url: 'https://hogyx-tap-front.vercel.app'}}],
                                [{text: '✨ Подписатсья на канал', url: 'https://t.me/hogyx_io'}],
                            ]
                        })
                    });
                } catch (e) {
                    console.log('can\'t find video')
                }
            }
        }
    }

    static async pre_checkout_query(data) {
        const { id } = data

        await bot.answerPreCheckoutQuery(id, true)
    }

    async channelWebhook(req, res, next) {
        console.log('HOOK', req.body)

        try {
            const {
                chat_member,
                message,
                pre_checkout_query,
            } = req.body

            if(chat_member) await UserController.chat_member(chat_member)
            else if(message) await UserController.message(message)
            else if(pre_checkout_query) await UserController.pre_checkout_query(pre_checkout_query)

            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();