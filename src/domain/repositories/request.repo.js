const BaseRepository = require("./base.repo");
const RequestAdSchema = require("../models/request.ad.model");
const mongoose = require("mongoose");

class RequestRepo extends BaseRepository {
    constructor() {
        super(mongoose.model('Request', RequestAdSchema));
    }
}

module.exports = new RequestRepo();