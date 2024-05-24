const service = require("../../domain/services/auth.service");
const { setCookie } = require("../../utils/helpers/helpers");

const register = async (req, res, next) => {
  try {
    let _res = await service.register(req.body);
    res.send(_res);
  } catch (_err) {
    next(_err);
  }
};
const login = async (req, res, next) => {
  try {
    let _res = await service.login(req.body);
    setCookie(res, "x-access", "Bearer " + _res.data.accessToken);
    setCookie(res, "x-refresh", "Bearer " + _res.data.refreshToken);
    res.send(_res);
  } catch (_err) {
    next(_err);
  }
};
const logout = async (req, res, next) => {
  try {
    await service.logout(req.user.sub);
    const cookies = req.cookies;
    // Loop through all cookies and clear each one
    for (const cookieName in cookies) {
      console.log("Clearing cookie: ", cookieName);
      res.clearCookie(cookieName, { path: "/" });
    }
    res.send({ message: "logout success" });
  } catch (_err) {
    next(_err);
  }
};
const refreshToken = async (req, res, next) => {
  try {
    let _res = await service.refreshTokens(req.query["refreshToken"] || req.cookies["x-refresh"].split(' ')[1]);
    setCookie(res, "x-access", "Bearer " + _res.data.accessToken);
    setCookie(res, "x-refresh", "Bearer " + _res.data.refreshToken);
    res.send(_res);
  } catch (_err) {
    next(_err);
  }
};
const changePassword = async (req, res, next) => {
  try {
    let _res = await service.changePassword(req.user.sub, req.body);
    res.send(_res);
  } catch (_err) {
    next(_err);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  changePassword
};
