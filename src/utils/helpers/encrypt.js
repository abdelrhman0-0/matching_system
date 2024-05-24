const bcrypt = require('bcrypt');
module.exports = {
    hash: function (password) {
        return bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));
    },
    compare: function (password, passwordHash) {
        return bcrypt.compare(password, passwordHash);
    }
};