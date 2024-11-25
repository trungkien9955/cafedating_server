const mongoose = require('mongoose')
const notiSchema = new mongoose.Schema({
    type: {
        required: true,
        type:String
    },
    senderId:{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiverId:{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        required: true,
        type:String
    },
    body: {
        required: true,
        type:String
    },
    isRead: {
        required: true,
        type:Boolean
    },
},{timestamps:true})
notiSchema.index({createdAt: 1},{expireAfterSeconds: 1200});

const NotiModel = mongoose.model('Noti', notiSchema)
module.exports = NotiModel