const Joi = require('joi');
module.exports = Joi.object({
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
});

