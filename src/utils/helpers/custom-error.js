const STATUS_CODES = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500,
    BAD_REQUEST_DUPLICATE: 11000
};

const ERROR_MESSAGES = {
    400: "ERROR_MSG_BAD_REQUEST",
    401: "ERROR_MSG_UNAUTHORIZED",
    500: "ERROR_MSG_SOMETHING_WRONG",
    11000: "ERROR_MSG_DUPLICATE_KEY",
};
class CustomHttpError extends Error {
    constructor(_statusCode, _message, _data, _status) {
        super(_message || ERROR_MESSAGES[_statusCode] || "ERROR_MSG_CUSTOM");
        this.name = "CustomHttpError";
        this.httpStatusCode = _statusCode;
        this.timestamp = new Date().toISOString();
        this.data = _data;
        this.status = _status;
        Error.captureStackTrace(this, this.constructor);
    }
}

const CustomErrorHandler = (err, req, res, next) => {
    // default HTTP status code and error message
    let httpStatusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
    let message = err.message || ERROR_MESSAGES[STATUS_CODES.INTERNAL_SERVER_ERROR];
    let data = err.data || undefined;
    // return the stack trace only when developing locally or in stage
    let stackTrace = process.env.NODE_ENV == "local" ? err.stack : undefined;
    // log the error
    console.error(`❌ ERROR [ LOGGER ] : ${err.message || err} `);
    // other custom behaviors...
    // DB validation error
    switch (err.name) {
        case "CustomHttpError":
            httpStatusCode = err.httpStatusCode;
            break;
        case "ValidationError":
        case "MulterError":
            httpStatusCode = STATUS_CODES.BAD_REQUEST;
            message = ERROR_MESSAGES[`${STATUS_CODES.BAD_REQUEST}`]
            break;
        case "UnauthorizedError":
            httpStatusCode = STATUS_CODES.UNAUTHORIZED;
            message = ERROR_MESSAGES[`${STATUS_CODES.UNAUTHORIZED}`]
            break;
        case "HttpError":
            httpStatusCode = err.httpStatusCode;
            message = err.message;
            break;
        case "MongoServerError":
            switch (err.code) {
                case 11000:
                    httpStatusCode = STATUS_CODES.BAD_REQUEST;
                    message = ERROR_MESSAGES[`${STATUS_CODES.BAD_REQUEST_DUPLICATE}`];
                    break;
                case 13: // Unauthorized
                    httpStatusCode = STATUS_CODES.UNAUTHORIZED;
                    message = ERROR_MESSAGES[`${STATUS_CODES.UNAUTHORIZED}`];
                    break;
                // Add more cases as needed...
                default:
                    httpStatusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
                    message = ERROR_MESSAGES[`${STATUS_CODES.INTERNAL_SERVER_ERROR}`];
            }
            break;
        default:
            break;
    }
    // return the standard error response
    res.status(httpStatusCode).send({
        code: httpStatusCode,
        status: undefined,
        message: message,
        data: data,
        timestamp: err.timestamp || new Date().toISOString(),
        stackTrace: stackTrace,
    });
}

module.exports = {
    CustomHttpError,
    CustomErrorHandler,
};