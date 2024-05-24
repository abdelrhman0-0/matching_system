const { CustomHttpError } = require("../../utils/helpers/custom-error");
const RequestRepository = require("../repositories/request.repo");
const BaseService = require("./base.service");
const UserService = require("./user.service");
const AdService = require("./ad.service");
class RequestService extends BaseService {
  constructor() {
    super(RequestRepository);
  }
  async createRecord(_data, _user) {
    _data.createdBy = _user;
    let _res = await this.repository.create(_data);
    return { data: _res, message: "SUCCESS_MSG_RECORD_CREATED" };
  }

  async getMatchedRequests(_id, _query) {
    const page = parseInt(_query.page) || 1;
    const limit = parseInt(_query.limit) || 10;
    const _data = await AdService.getRecordById(_id);
    if (!_data) throw new CustomHttpError(404, "ERROR_MSG_NO_RECORD_FOUND");
    const _res = await this.repository.aggregate([
      {
        $match: {
          district: _data.district,
          area: _data.area,
          price: {
            $gte: 0.9 * _data.price,
            $lte: 1.1 * _data.price,
          },
        },
      },
      {
        $sort: { refreshedAt: -1 },
      },
      {
        $facet: {
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          metadata: [{ $count: "total" }, { $addFields: { page: page } }],
        },
      },
    ]);
    return { data: _res[0]?.data, ..._res[0]?.metadata[0] };
  }

  async getMyRequests(_user, _filters = {}) {
    _filters.createdBy = _user;
    return await this.repository.list(_filters, "-__v -createdAt -updatedAt");
  }

  async refreshRequests() {
    return await this.repository.updateMany({}, { $set: { refreshedAt: new Date() } });
  }
}
module.exports = new RequestService();
