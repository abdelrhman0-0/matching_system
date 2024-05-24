const Joi = require('joi');
module.exports = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "VALIDATION_MSG_NAME_EMPTY",
        "any.required": "VALIDATION_MSG_NAME_REQUIRED",
        "string.base": "VALIDATION_MSG_NAME_INVALID",
    }),
    phone: Joi.string().regex(/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/).messages({
        "string.base": "VALIDATION_MSG_PHONE_INVALID",
        "string.pattern.base": "VALIDATION_MSG_PHONE_INVALID",
    }),
    password: Joi.string().min(3).max(30).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{3,}$/).required().messages({
        "string.empty": "VALIDATION_MSG_PASSWORD_EMPTY",
        "any.required": "VALIDATION_MSG_PASSWORD_REQUIRED",
        "string.base": "VALIDATION_MSG_PASSWORD_INVALID",
        "string.min": "VALIDATION_MSG_PASSWORD_MIN",
        "string.max": "VALIDATION_MSG_PASSWORD_MAX",
        "string.pattern.base": "VALIDATION_MSG_PASSWORD_PATTERN",
    }),
    role: Joi.string().required().messages({
        "string.base": "VALIDATION_MSG_ROLE_INVALID",
        "any.required": "VALIDATION_MSG_ROLE_REQ",
        "string.empty": "VALIDATION_MSG_ROLE_EMPTY",

    }),
});

