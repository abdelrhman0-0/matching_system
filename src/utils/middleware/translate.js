const translations = require('./../helpers/error-messages-translation.json');
const translateMiddleware = (req, res, next) => {
    // Save the original send function
    const originalSend = res.send;
    // Override the send function
    res.send = function (_data) {
        if (res.statusCode && _data && _data.message) {
            // Translate the message in success response
            _data.code = res.statusCode;
            _data.status = (res.statusCode >= 200 && res.statusCode < 300 ? 'SUCCESS' : 'ERROR');
            if (Array.isArray(_data.message)) {
                _data.message = _data.message.map(error => translations[req.headers.language || 'en'][error] || error);
            } else {
                _data.message = translations[req.headers.language || 'en'][_data.message] || _data.message;
            }
            _data.timestamp = _data.timestamp || new Date().toISOString();
        }
        // Send the response with translated message
        originalSend.call(this, _data);
    };
    // Call the next middleware function
    next();
};

module.exports = translateMiddleware;
