module.exports = class UserDto {
    id;
    tg_id;
    skill_level;
    energy;
    hour_amount;
    tap_amount;
    balance;
    max_energy;
    name;
    taps_count;
    ref_code;
    ref_user;
    experience;

    constructor(model) {
        this.id = model._id;
        this.tg_id = model.tg_id;
        this.name = model.name;
        this.skill_level = model.skill_level;
        this.energy = model.energy;
        this.hour_amount = model.hour_amount;
        this.tap_amount = model.tap_amount;
        this.balance = model.balance;
        this.max_energy = model.max_energy;
        this.taps_count = model.taps_count;
        this.ref_code = model.ref_code;
        this.ref_user = model.ref_user;
        this.experience = model.experience;
    }
}