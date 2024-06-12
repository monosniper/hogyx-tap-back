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
const {percents} = require("./config");

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

                bot.setWebHook("https://tap-api.hogyx.io/api/channel-webhook", {
                    allowed_updates: JSON.stringify(['chat_member'])
                })

                cron.schedule('* * * * *', async () => {
                    console.log('running a task every minute');

                    // Friends ref percent
                    const users = await UserModel.find({}).populate('friends')

                    users.forEach((user) => {
                        user.friends.forEach(friend => {
                            if(friend.balance_by_day) {
                                const percent = (friend.balance_by_day / 100) * percents.ref

                                user.balance += percent
                                user.save()

                                NotificationService.store(user._id, 'ref_percent', {amount: percent})
                            }

                            friend.balance_by_day = 0
                            friend.save()
                        })
                    })
                });
            })
        });
    } catch (e) {
        console.log(e)
    }
}

start();