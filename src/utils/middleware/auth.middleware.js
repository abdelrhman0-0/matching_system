const passport = require('passport');
const AuthService = require('../../domain/services/auth.service');
const { CustomHttpError } = require('../helpers/custom-error');
const { setCookie } = require('../helpers/helpers');
exports.authorize = (...strategies) => async (req, res, next) => {
    try {
        const authenticateAsync = (req, res) => new Promise((resolve, reject) => {
            passport.authenticate(strategies, { session: false, failWithError: true }, (err, user, info) => {
                if (err) return reject(err);
                resolve({user, info });
            })(req, res, next);
        });
        const { user, info } = await authenticateAsync(req, res);
        if(info?.length && info[0]?.name === 'TokenExpiredError' && !req.cookies['x-refresh'] && !req.cookies['x-access']){
            return next(new CustomHttpError(401, 'ERROR_MSG_INVALID_TOKEN'));
        }else if (info?.length && info[0]?.name === 'TokenExpiredError' || (req.cookies['x-refresh'] && !req.cookies['x-access'])) {
            // Token refresh logic
            const _res = await AuthService.refreshTokens(req.cookies['x-refresh']?.split(' ')[1]);
            // Set cookies and user in the request
            setCookie(res, 'x-access', 'Bearer ' + _res.data.accessToken);
            setCookie(res, 'x-refresh', 'Bearer ' + _res.data.refreshToken);
            req.user = _res.data;
            next();
        } else if (!user) {
            return next(new CustomHttpError(401, Array.isArray(info) && info.length > 1 ? info.map(i => i.message) : info[0].message));
        } else {
            req.user = user;
            next();
        }
    } catch (err) {
        next(new CustomHttpError(401, err.message));
    }
}
