const {Schema, model} = require('mongoose');
const {servers} = require("../config");
const Server = require("../Instances/Server");

const UserSchema = new Schema({
    tg_id: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
    balance: {type: Schema.Types.Number, default: 1000000},
    xbalance: {type: Schema.Types.Number, default: 0},
    balance_by_day: {type: Schema.Types.Number, default: 0},
    experience: {type: Schema.Types.Number, default: 0},
    tap_amount: {type: Schema.Types.Number, default: 1},
    hour_amount: {type: Schema.Types.Number, default: 0},
    energy: {type: Schema.Types.Number, default: 500},
    max_energy: {type: Schema.Types.Number, default: 500},
    taps_count: {type: Schema.Types.Number, default: 0},
    skill_level: {type: Schema.Types.Number, default: 1},
    energy_level: {type: Schema.Types.Number, default: 1},
    hour_level: {type: Schema.Types.Number, default: 1},
    tap_level: {type: Schema.Types.Number, default: 1},
    offline_income: {type: Schema.Types.Number, default: 0},
    ref_code: {type: String},
    hogyx_user_id: {type: String},
    last_site_visit: {type: Date},
    subscribed: {type: Boolean, default: false},
    inst_subscribed: {type: Boolean, default: false},
    tt_subscribed: {type: Boolean, default: false},
    last_user_online: {type: Date},
    last_day_gift: {type: Date},
    start_offline_income: {type: Date},
    last_notified_offline: {type: Date},
    last_notified_energy: {type: Date},
    language_code: {type: String, default: 'ru'},
    current_day: {type: Schema.Types.Number, default: 0},
    servers: {type: Array, default: servers.map(server => new Server(server))},
}, {timestamps: true});

module.exports = model('User', UserSchema);