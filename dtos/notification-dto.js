module.exports = class UserDto {
    id;
    type;
    data;

    constructor(model) {
        this.id = model._id;
        this.type = model.type;
        this.data = model.data;
    }
}