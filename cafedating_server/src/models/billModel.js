const { default: mongoose } = require("mongoose");
const BillSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    authorId: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    status: 
        {
            type: String,
            default: "Pending"
        },
    createdAt: 
        {
            type: Date,
            default: Date.now()
        },
    
})
const BillModel = mongoose.model('Bill', BillSchema)
module.exports = BillModel