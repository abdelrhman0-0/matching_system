const service = require("../../domain/services/user.service");
const getStatistics = async (req, res, next) => {
    try {
      let _res = await service.getStatistics(req.query);
      res.send(_res);
    } catch (_err) {
      next(_err);
    }
  };

  module.exports = {
    getStatistics
  };