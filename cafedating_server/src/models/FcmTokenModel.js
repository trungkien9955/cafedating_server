const { default: mongoose } = require("mongoose");

const fcmTokenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
})
const FcmTokenModel = mongoose.model('FcmToken', fcmTokenSchema)
module.exports = FcmTokenModel