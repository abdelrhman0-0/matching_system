const RequestAdSchema = require("../models/request.ad.model");
const monoose = require("mongoose");
const BaseRepository = require("./base.repo");

class AdRepo extends BaseRepository {
    constructor() {
        super(monoose.model('Ad', RequestAdSchema));
    }
}

module.exports = new AdRepo();