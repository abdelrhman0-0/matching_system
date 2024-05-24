const { authorize } = require("../../utils/middleware/auth.middleware");
// LOAD CONTROLLER
const {
  register,
  login,
  logout,
  refreshToken,
  changePassword,
} = require("../controllers/auth.controller");
// LOAD VALIDATORS
const {
  auth_register,
  auth_login,
  auth_change_password,
} = require("../../utils/dto/validator");
module.exports = (_express, _app) => {
  const router = _express.Router();
  // REGISTER
  router.post("/register", auth_register("body"), register);
  // LOGIN
  router.post("/login", auth_login("body"), login);
  // LOGOUT
  router.get("/logout", authorize("jwt"), logout);
  // REFRESH TOKEN
  router.get("/refresh-tokens", refreshToken);
  // CHANGE PASSWORD
  router.post(
    "/change-password",
    auth_change_password("body"),
    authorize("jwt"),
    changePassword
  );
  return router;
};
