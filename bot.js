const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    // testEnvironment: true,
    testEnvironment: false,
});

module.exports = bot