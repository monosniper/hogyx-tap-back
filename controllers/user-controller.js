const UserService = require('../services/user-service');
const bot = require("../bot");
const lang = require("../lang");

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
            const { hogyx_user_id } = req.params
            await UserService.siteVisited(hogyx_user_id);

            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }

    async accountLink(req, res, next) {
        try {
            const { hogyx_user_id } = req.params
            await UserService.accountLink(hogyx_user_id);

            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }

    async channelWebhook(req, res, next) {
        console.log('HOOK', req.body)

        try {
            const { chat_member, message } = req.body

            if(chat_member) {
                const {
                    chat: { id: chat_id },
                    from: { id: user_tg_id },
                    new_chat_member
                } = chat_member

                if(new_chat_member) {
                    const { status } = new_chat_member

                    console.log('status', status, user_tg_id)

                    if(chat_id.toString() === (process.env.CHANNEL_ID).toString() && status === 'member') {
                        await UserService.subscribed(user_tg_id)
                    }
                }
            } else if (message) {
                const { text, chat: { id, first_name }, from: { language_code, isPremium } } = message

                if(text === '/start') {
                    const user = await UserService.login(id, first_name, false, isPremium, language_code)
                    await bot.sendMessage(id, lang(language_code).start(user.ref_code), {
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [{text: '🕹️ Начать игру', web_app: {url: 'https://hogyx-tap-front.vercel.app'}}],
                                [{text: '✨ Подписатсья на канал', url: 'https://t.me.hogyx_io'}],
                            ]
                        })
                    });
                }
            }
        } catch (e) {
            next(e);
        }

        return res.json('ok');
    }
}

module.exports = new UserController();