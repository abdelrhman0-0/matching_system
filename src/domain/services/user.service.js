const UserRepository = require("../repositories/user.repo");
const BaseService = require("./base.service");
class AccService extends BaseService {
  constructor() {
    super(UserRepository);
  }
  async deleteRecordById(_id) {
    let _res = await this.repository.update({ _id }, { status: "DELETED" });
    if (!_res) throw new CustomHttpError(404, "Record is not found");
    return { data: _res, message: "Record deleted successfully" };
  }

  async getStatistics(_query) {
    const page = parseInt(_query.page) || 1;
    const limit = parseInt(_query.limit) || 10;
    const pipeline = [
      {
        $lookup: {
          from: "ads",
          localField: "_id",
          foreignField: "createdBy",
          as: "userAds",
        },
      },
      {
        $lookup: {
          from: "requests",
          localField: "_id",
          foreignField: "createdBy",
          as: "userRequests",
        },
      },
      {
        $project: {
          name: 1,
          phone: 1,
          role: 1,
          status: 1,
          adsCount: { $size: "$userAds" },
          totalAdsAmount: { $sum: "$userAds.price" },
          requestsCount: { $size: "$userRequests" },
          totalRequestsAmount: { $sum: "$userRequests.price" },
        },
      },
      {
        $facet: {
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          metadata: [
            { $count: "total" },
            {
              $addFields: {
                page: page,
                limit,
                total: "$total",
                hasNextPage: { $gte: ["$total", page * limit] },
                hasPrevPage: { $gt: [page, 1] },
              },
            },
          ],
        },
      },
    ];

    const results = await this.repository.aggregate(pipeline);
    return { data: results[0]?.data, ...results[0]?.metadata[0] };
  }
}
module.exports = new AccService();
