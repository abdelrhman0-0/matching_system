
module.exports = class BaseRepository {
    constructor(_model) {
        this.model = _model;
    }
    async list(_findObj = {}, _projection = "") {
        return await this.model.find(_findObj, _projection);
    }
    async findOne(_findObj, _projection = "") {
        return await this.model.findOne(_findObj, _projection);
    }
    async create(_obj) {
        let newObj = new this.model(_obj);
        await newObj.save();
        return newObj;
    }
    async update(_findObj, _obj, _project = "") {
        return await this.model.findOneAndUpdate(_findObj, _obj, { projection: _project, new: true })
    }
    async delete(_findObj) {
        return await this.model.findOneAndDelete(_findObj);
    }
    async deleteMany(_findObj) {
        return await this.model.deleteMany(_findObj);
    }
    async updateUpsert(_findObj, _obj, _project = "") {
        return await this.model.findOneAndUpdate(_findObj, _obj, { upsert: true, projection: _project, new: true })
    }
    async aggregate(_pipeline = []) {
        return await this.model.aggregate(_pipeline);
    }
    async ObjectId(_id) {
        return await this.model.ObjectId(_id);
    }

    async countDocuments(_query) {
        return await this.model.countDocuments(_query);
    }

    async updateMany(_query, _data) {
        return await this.model.updateMany(_query, _data);
    }
}
