const { CustomHttpError } = require("../helpers/custom-error");

const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new CustomHttpError(403, "ERROR_MSG_UNAUTHORIZED"));
    }
    next();
};
module.exports = checkRole;
