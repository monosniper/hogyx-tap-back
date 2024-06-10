const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    tg_id: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
    balance: {type: Schema.Types.Number, default: 0},
    experience: {type: Schema.Types.Number, default: 0},
    tap_amount: {type: Schema.Types.Number, default: 1},
    hour_amount: {type: Schema.Types.Number, default: 0},
    energy: {type: Schema.Types.Number, default: 100},
    max_energy: {type: Schema.Types.Number, default: 100},
    taps_count: {type: Schema.Types.Number, default: 0},
    skill_level: {type: Schema.Types.Number, default: 1},
    current_day: {type: Schema.Types.Number, default: 1},
    ref_code: {type: String},
    hogyx_user_id: {type: String},
    visited_site: {type: Boolean, default: false},
    subscribed: {type: Boolean, default: false},
}, {timestamps: true});

module.exports = model('User', UserSchema);