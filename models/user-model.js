const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    tg_id: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    balance: {type: Schema.Types.Number, default: 0},
    tap_amount: {type: Schema.Types.Number, default: 2},
    hour_amount: {type: Schema.Types.Number, default: 50},
    energy: {type: Schema.Types.Number, default: 1000},
    taps_count: {type: Schema.Types.Number, default: 0},
    skill_level: {type: Schema.Types.Number, default: 1},
}, {timestamps: true});

module.exports = model('User', UserSchema);