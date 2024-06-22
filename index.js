require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const UserModel = require('./models/user-model');
const NotificationService = require('./services/notification-service');
const {percents, main} = require("./config");
const diff_hours = require("./helpers/diffHours");
const diff_minutes = require("./helpers/diffMinutes");
const UserService = require("./services/user-service");
// const bot = require("./bot");

const PORT = process.env.PORT || 5000;

const app = express()

app.use(express.json());
app.use(fileUpload({
    createParentPath: true
}));
app.use(cookieParser());
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        callback(null, true)
    }
}
app.use(cors(corsOptions));
app.use('/api', router);
app.use(errorMiddleware);
app.use(express.static('uploads', {
    setHeaders: function (res, path, stat) {
        res.set('Content-Type', 'image/png')
    }
}));

const texts = {
    start: {
        ru: (ref_code) => `
Добро пожаловать в HOGYX! Нажимай на монетку и увеличивай свой баланс 🤝
        
- Поднимитесь на вершину таблицы лидеров и получите вкусные награды в виде Airdrops. 🥇
- Большая часть распределения токенов HOGYX (HOG) произойдет среди игроков здесь. 🪂
- Следи за новыми заданиями ведь кроме токена у тебя есть шанс получить уникальные награды. 🎁
                
Твоя реферальная ссылка: https://t.me/hogyx_tap_bot/app?startapp=${ref_code}
        `,
        en: (ref_code) => `
Welcome to HOGYX! Click on the coin and increase your balance 🤝
 
- Climb to the top of the leaderboard and get delicious rewards in the form of Airdrops. 🥇
- Most of the distribution of HOGYX (HOG) tokens will happen among the players here. 🪂
- Keep an eye on new tasks, because besides the token, you have a chance to get unique rewards. 🎁
             
Your referral link: https://t.me/hogyx_tap_bot/app?startapp=${ref_code}
        `,
    }
}
// const bot = new TelegramBot('6441349723:AAHHFviVr0e3ORa8Gb6ZCyLKN-5_rr3pqPI', { polling: true, });
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true, });

const start = () => {
    try {
        mongoose.connect(process.env.DB_URL, { dbName: 'hogyx-tap' }).then(() => {
            app.listen(PORT, () => {
                console.log('Server started at port ' + PORT);

                bot.on('message', async msg => {
                    const { text, chat: { id, first_name }, from: { language_code } } = msg

                    if(text === '/start') {
                        const user = await UserService.login(id, first_name)
                        await bot.sendMessage(id, texts.start[language_code](user.ref_code));
                    }
                });

                cron.schedule('0 0 * * *', async () => {
                    console.log('running every day tasks');

                    // Friends ref percent
                    const users = await UserModel.find({}).populate('friends')

                    users.forEach((user) => {
                        user.energy = user.max_energy

                        user.friends.forEach(friend => {
                            let total_percent = 0

                            if(friend.balance_by_day) {
                                const percent = Math.round((friend.balance_by_day / 100) * percents.ref)

                                total_percent += percent
                            }

                            if(total_percent) {
                                user.balance += total_percent

                                NotificationService.store(user._id, 'ref_percent', {amount: percent})
                            }

                            friend.balance_by_day = 0
                            friend.save()
                        })

                        user.save()
                    })
                });

                // Hour income
                cron.schedule('0 * * * *', async () => {
                    console.log('running every hour tasks');

                    const users = await UserModel.find({})

                    users.forEach((user) => {
                        if(diff_minutes(new Date(), user.last_user_online) > 5) {
                            if(!user.start_offline_income) user.start_offline_income = new Date()

                            const diff = diff_hours(new Date(), user.start_offline_income)

                            if(diff < 24) {
                                user.offline_income += user.hour_amount
                            } else if(diff_hours(new Date(), user.last_notified_offline) > 24) {
                                bot.sendMessage(user.tg_id, 'Вы достигли максимальной ежедневной награды - ' + user.offline_income + ', зайдите, чтобы ее забрать!').catch((error) => {
                                    console.log(error.code);
                                    console.log(error.response.body);
                                });
                                user.last_notified_offline = new Date()
                            }

                            user.save()
                        }
                    })
                });

                async function everyMinute (){
                    console.log('running every minute tasks');

                    const users = await UserModel.find({})

                    users.forEach((user) => {
                        if((diff_minutes(new Date(), user.last_user_online) > 1)) {
                            user.energy += 60 / main.energy_recovery

                            if(user.energy > user.max_energy) {
                                user.energy = user.max_energy
                            }

                            const diff = diff_hours(new Date(), user.last_notified_energy)

                            if(user.energy === user.max_energy && diff > 24) {
                                bot.sendMessage(user.tg_id, 'Энергия восстановлена - заходи скорее!').catch((error) => {
                                    console.log(error.code);
                                    console.log(error.response.body);
                                });
                                user.last_notified_energy = new Date()
                            }

                            user.save()
                        }
                    })
                }

                // Energy recovery
                cron.schedule('* * * * *', everyMinute);
            })
        });
    } catch (e) {
        console.log(e)
    }
}

start();