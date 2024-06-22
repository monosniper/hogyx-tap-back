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

const start = () => {
    try {
        mongoose.connect(process.env.DB_URL, { dbName: 'hogyx-tap' }).then(() => {
            app.listen(PORT, () => {
                console.log('Server started at port ' + PORT);

                const bot = new TelegramBot(process.env.BOT_TOKEN);
                console.log(process.env.BOT_TOKEN)
                bot.setWebHook("https://tap-api.hogyx.io/api/channel-webhook", {
                    allowed_updates: JSON.stringify(['message', 'chat_member'])
                })
                bot.getWebHookInfo().then(console.log)

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
                                    console.log(error.code, '134');
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
                                    console.log(error.code, '162');
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