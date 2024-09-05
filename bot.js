const TelegramBot = require("node-telegram-bot-api");
console.log(process.env.BOT_TOKEN)
const bot = new TelegramBot(process.env.BOT_TOKEN, {
    testEnvironment: true
});

module.exports = bot