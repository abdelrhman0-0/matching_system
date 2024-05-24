const mongoose = require('mongoose');
const timestamps = require("mongoose-timestamp");
const encrypt = require('../../utils/helpers/encrypt');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        set: encrypt.hash,
        required: true,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'DELETED'],
        default: 'ACTIVE',
    },
    role: {
        type: String,
        enum: ['ADMIN', 'CLIENT', 'AGENT'],
        required: true,
    },
    refreshToken: String,
});

userSchema.plugin(timestamps);
module.exports = mongoose.model('User', userSchema);
