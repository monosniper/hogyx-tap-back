const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    tg_id: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    ref_user: {type: Schema.Types.ObjectId},
    balance: {type: Schema.Types.Number, default: 0},
    experience: {type: Schema.Types.Number, default: 0},
    tap_amount: {type: Schema.Types.Number, default: 1},
    hour_amount: {type: Schema.Types.Number, default: 0},
    energy: {type: Schema.Types.Number, default: 100},
    max_energy: {type: Schema.Types.Number, default: 100},
    taps_count: {type: Schema.Types.Number, default: 0},
    skill_level: {type: Schema.Types.Number, default: 1},
    ref_code: {type: String},
}, {timestamps: true});

module.exports = model('User', UserSchema);