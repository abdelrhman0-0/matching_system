const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
module.exports = Joi.object({
    area: Joi.number().optional().messages({
        "number.base": "VALIDATION_MSG_AREA_INVALID",
    }),
    price: Joi.number().optional().messages({
        "number.base": "VALIDATION_MSG_PRICE_INVALID",
    }),
    description: Joi.string().optional().messages({
        "string.base": "VALIDATION_MSG_DESCRIPTION_INVALID",
    })
});