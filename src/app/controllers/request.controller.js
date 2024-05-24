const service = require("../../domain/services/request.service");

const getAll = async (req, res, next) => {
  try {
    let _res = await service.listRecords(req.query);
    res.send(_res);
  } catch (_err) {
    next(_err);
  }
};

const getOne = async (req, res, next) => {
  try {
    let _res = await service.getRecordById(req.params.id);
    res.send(_res);
  } catch (_err) {
    next(_err);
  }
};

const create = async (req, res, next) => {
  try {
    let _res = await service.createRecord(req.body, req.user.sub);
    res.send(_res);
  } catch (_err) {
    next(_err);
  }
};

const update = async (req, res, next) => {
  try {
    let _res = await service.updateRecordById(req.params.id, req.body);
    res.send(_res);
  } catch (_err) {
    next(_err);
  }
};

const remove = async (req, res, next) => {
  try {
    let _res = await service.deleteRecordById(req.params.id);
    res.send(_res);
  } catch (_err) {
    next(_err);
  }
};

const getMyRequests = async (req, res, next) => {
  try {
    let _res = await service.getMyRequests(req.user.sub, req.query);
    res.send(_res);
  } catch (_err) {
    next(_err);
  }
};

const getMatchedRequests = async (req, res, next) => {
  try {
    let _res = await service.getMatchedRequests(req.params.id, req.query);
    res.send(_res);
  } catch (_err) {
    next(_err);
  }
};




module.exports = {
    create,
    update,
    remove,
    getAll,
    getOne,
    getMyRequests,
    getMatchedRequests
};

