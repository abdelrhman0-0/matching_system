const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const { CustomHttpError } = require('../helpers/custom-error');
let schemaObj = {};
const validator = (schema) => (payload = 'body') => {
  return async (req, res, next) => {
    try {
      // Check if the schema is a valid Joi schema
      if (!Joi.isSchema(schema))
        throw new CustomHttpError(403, "ERROR_MSG_VALID_SCHEMA", undefined, 'VALIDATION_ERROR')

      // Check if the payload type is valid
      if (!['body', 'query', 'params'].includes(payload))
        throw new CustomHttpError(403, "ERROR_MSG_VALID_PAYLOAD_TYPE", undefined, 'VALIDATION_ERROR')

      // Check if the payload exists and is of the expected data type (an object)
      if (!req[payload] || typeof req[payload] !== 'object' || Object.keys(req[payload]).length === 0)
        throw new CustomHttpError(403, "ERROR_MSG_VALID_PAYLOAD", undefined, 'VALIDATION_ERROR')

      // Validate the payload using the provided schema
      await schema.validateAsync(req[payload], { abortEarly: false, allowUnknown: false });
      // If validation succeeds, proceed to the next middleware
      next();
    } catch (_err) {
      if (_err.name === 'CustomHttpError') return next(_err);
      const errors = _err.details?.map(detail => detail.message.replace(/"/g, ''));
      _err.name = 'CustomHttpError';
      _err.httpStatusCode = 403;
      _err.message = errors
      next(_err);
    }
  };
};
const getAllFiles = (dir, baseDir = '') => {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const itemPath = path.join(dir, item.name);
    const relativePath = path.join(baseDir, item.name);
    if (item.isDirectory()) {
      const subFiles = getAllFiles(itemPath, relativePath);
      files = [...files, ...subFiles];
    } else
      files.push(relativePath);
  }
  return files;
};
const Schemas = getAllFiles(path.join(__dirname, 'models'));
Schemas.forEach(schema => {
  const sch = require('./models/' + schema.replace('.js', ''))
  schemaObj[schema.replace(/\//g, '_').replace(/\\/g, '_').replace('.request.js', '')] = validator(sch);
});
module.exports = schemaObj;