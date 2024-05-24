const UserSchema = require("../models/user.model");
const BaseRepository = require("./base.repo");

class UserRepo extends BaseRepository {
    constructor() {
        super(UserSchema);
    }

    async list(_findObj = {}, _projection = "-__v -createdAt -updatedAt -password -refreshToken") {
        return await this.model.find(_findObj, _projection);
    }


    async findOne(_findObj, _projection = "-__v -createdAt -updatedAt -password -refreshToken") {
        return await this.model.findOne(_findObj, _projection);
    }


    async create(_obj) {
        let newObj = new this.model(_obj);
        newObj = await newObj.save();
        newObj = newObj.toObject();
        delete newObj.password;
        delete newObj.refreshToken;
        return newObj;
    }

    async update(_findObj, _obj, _options = {new:true, projection: "-__v -createdAt -updatedAt -password -refreshToken" }) {
        return await this.model.findOneAndUpdate(_findObj, _obj, _options);
    }

    async delete(_findObj, _options = { projection: "-__v -createdAt -updatedAt -password -refreshToken" }) {
        return await this.model.findOneAndDelete(_findObj, _options);
    }
}

module.exports = new UserRepo();