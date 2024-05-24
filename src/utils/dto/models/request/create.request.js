const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
module.exports = Joi.object({
    propertyType: Joi.string().required().valid('VILLA', 'HOUSE', 'LAND', 'APARTMENT').messages({
        "string.empty": "VALIDATION_MSG_PROPERTY_TYPE_EMPTY",
        "any.required": "VALIDATION_MSG_PROPERTY_TYPE_REQUIRED",
        "string.base": "VALIDATION_MSG_PROPERTY_TYPE_INVALID",
        "any.only": "VALIDATION_MSG_PROPERTY_TYPE_INVALID",
    }),
    area: Joi.number().required().messages({
        "number.base": "VALIDATION_MSG_AREA_INVALID",
        "any.required": "VALIDATION_MSG_AREA_REQUIRED",
    }),
    price: Joi.number().required().messages({
        "number.base": "VALIDATION_MSG_PRICE_INVALID",
        "any.required": "VALIDATION_MSG_PRICE_REQUIRED",
    }),
    city: Joi.string().required().messages({
        "string.empty": "VALIDATION_MSG_CITY_EMPTY",
        "any.required": "VALIDATION_MSG_CITY_REQUIRED",
        "string.base": "VALIDATION_MSG_CITY_INVALID",
    }),
    district : Joi.string().required().messages({
        "string.empty": "VALIDATION_MSG_DISTRICT_EMPTY",
        "any.required": "VALIDATION_MSG_DISTRICT_REQUIRED",
        "string.base": "VALIDATION_MSG_DISTRICT_INVALID",
    }),
    description: Joi.string().required().messages({
        "string.empty": "VALIDATION_MSG_DESCRIPTION_EMPTY",
        "any.required": "VALIDATION_MSG_DESCRIPTION_REQUIRED",
        "string.base": "VALIDATION_MSG_DESCRIPTION_INVALID",
    })
});