const jwt = require('jsonwebtoken');
exports.sign = (_payload = {}, _secret = "", _options = {}) => {
    return jwt.sign(_payload, _secret, _options);
};
exports.verify = (_token = "", _secret = "", _options = {}) => {
    return jwt.verify(_token, _secret, _options);
};
exports.decode = (_token = "", _options = {}) => {
    return jwt.decode(_token, _options);
};