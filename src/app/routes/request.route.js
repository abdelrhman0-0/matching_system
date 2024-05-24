const { authorize } = require("../../utils/middleware/auth.middleware");
const checkRole = require("../../utils/middleware/role.middleware");
// LOAD CONTROLLER
const {
    update,
    getAll,
    getOne,
    create,
    remove,
    getMyRequests,
    getMatchedRequests
} = require("../controllers/request.controller");
const {request_create, request_update } = require("../../utils/dto/validator");

module.exports = (_express, _app) => {
    const router = _express.Router();
    // CREATE
    router.post("/", request_create("body"), authorize("jwt"), checkRole(["ADMIN", "CLIENT"]), create);
    // UPDATE
    router.put("/:id", request_update("body"), authorize("jwt"), checkRole(["ADMIN", "CLIENT"]),update);
    // DELETE
    router.delete("/:id", authorize("jwt"), checkRole(["ADMIN"]), remove);
    // GET ALL
    router.get("/", authorize("jwt"), checkRole(["ADMIN"]), getAll);
    // GET MY ADS
    router.get("/my", authorize("jwt"), checkRole(["ADMIN", "CLIENT"]), getMyRequests);
    // MATCHING REQUESTS
    router.get("/matches/:id", authorize("jwt"), checkRole(["ADMIN", "CLIENT","AGENT"]), getMatchedRequests);
    // GET ONE
    router.get("/:id", authorize("jwt"), checkRole(["ADMIN", "CLIENT"]), getOne);
    return router;
}