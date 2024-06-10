require('dotenv').config();
const NotificationModel = require('../models/notification-model');
const NotificationDto = require("../dtos/notification-dto");

class NotificationService {
    async store(user_id, type, data) {
        await NotificationModel.create({user: user_id, type, data});
    }

    async makeRead(id) {
        await NotificationModel.updateOne({_id: id}, {read_at: new Date()})
    }

    async getUnread(tg_id) {
        const notifications = await NotificationModel.find({read_at: null}).populate({path: 'user', match: { tg_id }}).exec();
        const filtered_notifications = notifications.filter(({user}) => user);

        return filtered_notifications.map(note => new NotificationDto(note));
    }
}


module.exports = new NotificationService();