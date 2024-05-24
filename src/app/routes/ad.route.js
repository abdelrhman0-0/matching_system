const { authorize } = require("../../utils/middleware/auth.middleware");
const checkRole = require("../../utils/middleware/role.middleware");
// LOAD CONTROLLER
const {
    update,
    getAll,
    getOne,
    create,
    remove,
    getMyAds
} = require("../controllers/ad.controller");
const {ad_create, ad_update } = require("../../utils/dto/validator");

module.exports = (_express, _app) => {
    const router = _express.Router();
    // CREATE
    router.post("/", ad_create("body"), authorize("jwt"), checkRole(["ADMIN", "AGENT"]), create);
    // UPDATE
    router.put("/:id", ad_update("body"), authorize("jwt"), checkRole(["ADMIN", "AGENT"]),update);
    // DELETE
    router.delete("/:id", authorize("jwt"), checkRole(["ADMIN"]), remove);
    // GET ALL
    router.get("/", authorize("jwt"), checkRole(["ADMIN"]), getAll);
    // GET MY ADS
    router.get("/my", authorize("jwt"), checkRole(["AGENT"]), getMyAds);
    // GET ONE
    router.get("/:id", authorize("jwt"), checkRole(["ADMIN", "AGENT"]), getOne);
    return router;
}