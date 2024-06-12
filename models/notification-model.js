const {Schema, model} = require('mongoose');

const NotificationSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    data: {type: JSON},
    type: {
        type: String,
        enum: [
            'day_gift',
            'ref_percent',
            'hour_income',
        ],
        default: 'day_gift',
    },
    read_at: {type: Date},
}, {timestamps: true});

module.exports = model('Notification', NotificationSchema);