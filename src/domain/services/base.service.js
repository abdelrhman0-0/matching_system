const { CustomHttpError } = require("../../utils/helpers/custom-error");

class BaseService {
    constructor(repository) {
        this.repository = repository;
    }

    async createRecord(_data) {
        let _res = await this.repository.create(_data)
        return { data: _res, message: "SUCCESS_MSG_RECORD_CREATED" };
    }

    async listRecords(_filters) {
        return await this.repository.list(_filters, '-__v -createdAt -updatedAt');
    }

    async getRecordById(_id) {
        return await this.repository.findOne({ _id }, '-__v -createdAt -updatedAt');
    }

    async updateRecordById(_id, _data) {
        let _res = await this.repository.update({ _id }, _data, '-__v -createdAt -updatedAt');
        if(!_res) throw new CustomHttpError(404, "ERROR_MSG_NO_RECORD_FOUND");
        return { data: _res, message:"SUCCESS_MSG_RECORD_UPDATED" };

    }

    async deleteRecordById(_id) {
        let _res = await this.repository.delete({ _id });
        if(!_res) throw new CustomHttpError(404, "ERROR_MSG_NO_RECORD_FOUND");
        return { data: _res, message: "SUCCESS_MSG_RECORD_DELETED"};
    }

    async deleteRecordByQuery(_query) {
        let _res = await this.repository.delete(_query);
        if(!_res) throw new CustomHttpError(404, "ERROR_MSG_NO_RECORD_FOUND");
        return { data: _res, message: "SUCCESS_MSG_RECORD_DELETED" };
    }

    async getRecordByQuery(_query) {
        return await this.repository.findOne(_query, '-__v -createdAt -updatedAt');
    }

    async getRecordByQueryOrCreate(_query, _data) {
        return await this.repository.updateUpsert(_query, _data, '-__v -createdAt -updatedAt');
    }

    async updateRecordByQuery(_query, _data) {
        let _res = await this.repository.update(_query, _data, '-__v -createdAt -updatedAt');
        if(!_res) throw new CustomHttpError(404, "ERROR_MSG_NO_RECORD_FOUND");
        return { data: _res, message: "SUCCESS_MSG_RECORD_UPDATED" };
    }
    async deleteManyRecords(_query) {
        let _res = await this.repository.deleteMany(_query);
        return { data: _res, message: "SUCCESS_MSG_RECORD_DELETED" };
    }

    async countDocuments(_query) {
        return await this.repository.countDocuments(_query);
    }

    async aggregate(_pipeline) {
        return await this.repository.aggregate(_pipeline);
    }
}

module.exports = BaseService;
