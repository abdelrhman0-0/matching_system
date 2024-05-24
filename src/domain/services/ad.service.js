const AdRepository = require("../repositories/ad.repo");
const BaseService = require("./base.service");
class AdService extends BaseService {
  constructor() {
    super(AdRepository);
  }
  async createRecord(_data, _user) {
    _data.createdBy = _user;
    let _res = await this.repository.create(_data);
    return { data: _res, message: "SUCCESS_MSG_RECORD_CREATED" };
  }
  async getMyAds(_user, _filters = {}) {
    _filters.createdBy = _user;
    return await this.repository.list(_filters, '-__v -createdAt -updatedAt');
  }
}
module.exports = new AdService();
