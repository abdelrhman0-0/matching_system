const mongoose = require('mongoose');
const timestamps = require("mongoose-timestamp");
const requestAdSchema = new mongoose.Schema({
    propertyType: {
        type: String,
        enum: ['VILLA', 'HOUSE', 'LAND', 'APARTMENT'],
        required: true,
    },
    area: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    refreshedAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

requestAdSchema.plugin(timestamps);
module.exports = requestAdSchema
