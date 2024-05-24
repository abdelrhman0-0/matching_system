const Joi = require('joi');
module.exports = Joi.object({
    password: Joi.string().min(3).max(30).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{3,}$/).required().messages({
        "string.empty": "VALIDATION_MSG_PASSWORD_EMPTY",
        "any.required": "VALIDATION_MSG_PASSWORD_REQUIRED",
        "string.base": "VALIDATION_MSG_PASSWORD_INVALID",
        "string.min": "VALIDATION_MSG_PASSWORD_MIN",
        "string.max": "VALIDATION_MSG_PASSWORD_MAX",
        "string.pattern.base": "VALIDATION_MSG_PASSWORD_PATTERN",
    }),
    password_new: Joi.string().min(3).max(30).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{3,}$/).custom((value, helpers) => {
        if (value === helpers.state.ancestors[0].password) {
            return helpers.message("VALIDATION_MSG_PASSWORD_NEW_INVALID_SAME_PASSWORD");
        }
        return value;
    }).messages({
        "string.empty": "VALIDATION_MSG_PASSWORD_NEW_EMPTY",
        "any.required": "VALIDATION_MSG_PASSWORD_NEW_REQUIRED",
        "string.base": "VALIDATION_MSG_PASSWORD_NEW_INVALID",
        "string.min": "VALIDATION_MSG_PASSWORD_NEW_MIN",
        "string.max": "VALIDATION_MSG_PASSWORD_NEW_MAX",
        "string.pattern.base": "VALIDATION_MSG_PASSWORD_NEW_PATTERN",
    }),
});