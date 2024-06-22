const TelegramBot = require("node-telegram-bot-api");
const UserService = require("./services/user-service");

const bot = new TelegramBot('7438284377:AAGQ20nSSjneAcxhfWPaUtymU4lK6VcQ5B8');
bot.startPolling().then(() => {
    console.log('dsad')

    bot.on('message', async msg => {
        const { text, chat: { id, first_name }, from: { language_code } } = msg

        if(text === '/start') {
            const user = await UserService.login(id, first_name)
            await bot.sendMessage(id, texts.start[language_code](user.ref_code));
        }
    });
})
// const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true, });

bot.setWebHook("https://tap-api.hogyx.io/api/channel-webhook", {
    allowed_updates: JSON.stringify(['message', 'chat_member'])
})

module.exports = bot