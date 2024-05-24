// passport.js
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const UserService = require('../../domain/services/user.service');
const { CustomHttpError } = require('./custom-error');
const { default: mongoose } = require('mongoose');

//#region Helpers
const customJwtExtractor = (req) => {
    try {
        let token = null;
        if (req?.cookies?.['x-access'] || req.headers.authorization)
            token = req.cookies['x-access'] || req.headers.authorization;
        if (!token) return;
        if (token.startsWith('Bearer ') ||
            token.startsWith('Token ') ||
            token.startsWith('JWT '))
            token = token.split(' ')[1];
        return token;
    } catch (err) {
        throw new CustomHttpError(401, "ERROR_MSG_INVALID_TOKEN");
    }
};
//#endregion
passport.use("jwt", new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        customJwtExtractor,
    ]),
    secretOrKey: process.env.JWT_ACCESS_SECRET,
    passReqToCallback: true
}, async (req, payload, done) => {
    try {
        const account = await UserService.getRecordByQuery({ _id: mongoose.Types.ObjectId.createFromHexString(payload.sub) });
        if (!account) return done(null, false, { message: "ERROR_MSG_NOT_EXISTED" });
        if (account.status !== 'ACTIVE') return done(null, false, { message: `Your account is ${account.status}` });
        let user = payload;
        return done(null, user);
    } catch (err) {
        return done(null, false, { message: "ERROR_MSG_INVALID_TOKEN" })
    }
}));

//#endregion
module.exports = passport;
