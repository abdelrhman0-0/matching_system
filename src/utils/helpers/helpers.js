const crypto = require('crypto');
module.exports = {
    generateOTP: () => {
        const randomBytes = crypto.randomBytes(3); // 3 bytes (24 bits) for a 6-digit OTP
        const otp = (parseInt(randomBytes.toString('hex'), 16) % 900000) + 100000; // Ensure 6 digits
        const otp_expires_at = new Date(new Date().setHours(new Date().getHours() + 1)); // 1 hour
        return {
            otp,
            otp_expires_at,
        };
    },
    generateDeviceLog: (_req) => {
        let device_log = {
            device_id: "",
            ip: _req.ip ||
                _req.headers["x-forwarded-for"] ||
                _req.connection.remoteAddress,
            device: _req.useragent.isMobile ? "Mobile" : "Desktop",
            user_agent: _req.headers["user-agent"],
            browser: _req.useragent.browser,
            os: _req.useragent.os,
            login_at: new Date(),
            platform: _req.useragent.platform,
            version: _req.useragent.version,
        };
        device_log.device_id = crypto
            .createHash("sha256")
            .update(device_log.ip + device_log.browser + device_log.user_agent)
            .digest("hex");
        if (_req.user?.provider) device_log.provider = _req.user.provider;
        return device_log;
    },

    // Sign Cookie Options
    setCookie: (_res, _name, _value, _options = {}) => {
        const defaultOptions = {
            httpOnly: true,
            domain: process.env.NODE_ENV == 'local' ? process.env.BASE_DOMAIN : "." + process.env.BASE_DOMAIN,
            path: "/",
            sameSite:'Lax',
            secure: false,
        };
        if(_options.maxAge) _options.maxAge = parseInt(_options.maxAge);
        const mergedOptions = { ...defaultOptions, ..._options };
        _res.cookie(_name, _value, mergedOptions);
    },
};