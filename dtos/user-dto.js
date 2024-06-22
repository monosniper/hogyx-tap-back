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
    friends;
    current_day;
    experience;
    hogyx_user_id;
    hour_level;
    energy_level;
    tap_level;
    last_site_visit;
    last_day_gift;
    inst_subscribed;
    tt_subscribed;

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
        this.friends = model.friends;
        this.energy_level = model.energy_level;
        this.tap_level = model.tap_level;
        this.experience = model.experience;
        this.current_day = model.current_day;
        this.subscribed = model.subscribed;
        this.hour_level = model.hour_level;
        this.hogyx_user_id = model.hogyx_user_id;
        this.last_site_visit = model.last_site_visit;
        this.last_day_gift = model.last_day_gift;
        this.inst_subscribed = model.inst_subscribed;
        this.tt_subscribed = model.tt_subscribed;
    }
}