const UserRepo = require('../repositories/user.repo');
const { CustomHttpError } = require('../../utils/helpers/custom-error');
const bcrypt = require('bcrypt');
const { sign, verify } = require('../../utils/helpers/jwt');


class AuthService {
    constructor() {
        this.repository = UserRepo;
    }
    async getTokens(_data) {
        const [accessToken, refreshToken] = await Promise.all([
            sign(
                {
                    sub: _data?._id,
                    email: _data?.email,
                    role: _data?.role,
                },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRATION) },
            ),
            sign(
                {
                    sub: _data?._id,
                    email: _data?.email,
                    role: _data?.role,
                },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRATION) },
            )
        ]);
        return {
            accessToken,
            refreshToken
        };
    };
    async register(_data) {
        const account = await this.repository.findOne({ phone: _data.phone });
        if (account && account.status == 'ACTIVE') throw new CustomHttpError(409, "ERROR_MSG_ACCOUNT_EXISTED");
        if (account && account.status == 'DELETED') throw new CustomHttpError(409, "ERROR_MSG_DELETED_ACCOUNT");       
        const _res = await this.repository.create(_data);
        return { message: "SUCCESS_MSG_RECORD_CREATED", data: _res };
    }
    async login(_data) {
        const account = await this.repository.findOne({ phone: _data.phone }, "-__v -createdAt -updatedAt -refreshToken");
        if (!account) throw new CustomHttpError(404, "ERROR_MSG_NO_RECORD_FOUND");
        if (account.status !== 'ACTIVE') throw new CustomHttpError(401, `Your account is ${account.status}`);
        if (!_data.password || !account.password) throw new CustomHttpError(400, "ERROR_MSG_LOGIN_FAILED");
        if (!bcrypt.compareSync(_data.password, account.password)) throw new CustomHttpError(401, "ERROR_MSG_LOGIN_FAILED");
        const tokens = await this.getTokens(account);
        await this.repository.update({ _id: account._id }, { refreshToken: tokens.refreshToken });
        let profile = account.toObject();
        delete profile.password; 
        return {message: "SUCCESS_MSG_LOGIN", data: { ...tokens, profile } };
    }
    async refreshTokens(_refreshToken) {
        const _id = verify(_refreshToken, process.env.JWT_REFRESH_SECRET).sub;
        const account = await this.repository.findOne({ _id }, "-__v -createdAt -updatedAt");
        if (!account) throw new CustomHttpError(404, "ERROR_MSG_NO_RECORD_FOUND");
        if (account.status !== 'ACTIVE') throw new CustomHttpError(401, `Your account is ${account.status}`);
        if (account.refreshToken !== _refreshToken) throw new CustomHttpError(401, "ERROR_MSG_INVALID_TOKEN");
        const tokens = await this.getTokens(account);
        return { message: "SUCCESS_MSG_REFRESH_TOKEN", data: {...tokens, sub: account._id, email: account.email, role: account.role}};
    }
    async changePassword(_user, _data) {
        let account = await this.repository.findOne({ _id: _user }, "-__v -createdAt -updatedAt -refreshToken");
        if (!account) throw new CustomHttpError(404, "ERROR_MSG_NO_RECORD_FOUND");
        if (!bcrypt.compareSync(_data.password, account.password)) throw new CustomHttpError(401, "ERROR_MSG_LOGIN_FAILED");
        let _res = await this.repository.update({ _id: _user }, { password: _data.password_new });
        if (!_res) throw new CustomHttpError(404, "ERROR_MSG_NO_RECORD_FOUND");
        return { message: "SUCCESS_MSG_RECORD_UPDATED", data: _res };
    }
    async logout(_user) {
        let _res = await this.repository.update({ _id: _user }, { refreshToken: null });
        if (!_res) throw new CustomHttpError(404, "ERROR_MSG_NO_RECORD_FOUND");
        return { message: "SUCCESS_MSG_RECORD_UPDATED", data: _res };
    }

}
module.exports = new AuthService();
