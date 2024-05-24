const { authorize } = require("../../utils/middleware/auth.middleware");
const checkRole = require("../../utils/middleware/role.middleware");
// LOAD CONTROLLER
const { getStatistics } = require("../controllers/user.controller");

module.exports = (_express, _app) => {
  const router = _express.Router();

  // STATS
  /**
 * @openapi
 * /api/user/stats:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get admin statistics
 *     description: This endpoint allows you to get admin statistics.
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: Statistics retrieved successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Forbidden
 *       '500':
 *         description: Internal server error
 */
  router.get("/stats", authorize("jwt"), checkRole(["ADMIN"]), getStatistics);
  return router;
};
