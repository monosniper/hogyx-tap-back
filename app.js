const TelegramBot = require('node-telegram-bot-api');

const token = '7438284377:AAHp71HlQuhU7rSxG7mDQLoT3eRlN3vZkV0';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
	const chatId = msg.chat.id;

	// send a message to the chat acknowledging receipt of their message
	bot.sendMessage(chatId, 'Received your message');
});
