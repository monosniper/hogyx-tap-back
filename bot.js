const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot('6441349723:AAHHFviVr0e3ORa8Gb6ZCyLKN-5_rr3pqPI', { polling: true, });
// const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true, });

bot.setWebHook("https://tap-api.hogyx.io/api/channel-webhook", {
    allowed_updates: JSON.stringify(['chat_member'])
})

module.exports = bot