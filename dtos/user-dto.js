module.exports = class UserDto {
    id;
    tg_id;
    skill_level;
    energy;
    hour_amount;
    tap_amount;
    balance;
    name;
    taps_count;

    constructor(model) {
        this.id = model._id;
        this.tg_id = model.tg_id;
        this.name = model.name;
        this.skill_level = model.skill_level;
        this.energy = model.energy;
        this.hour_amount = model.hour_amount;
        this.tap_amount = model.tap_amount;
        this.balance = model.balance;
        this.taps_count = model.taps_count;
    }
}