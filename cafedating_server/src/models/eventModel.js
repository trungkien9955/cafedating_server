const { default: mongoose } = require("mongoose");
const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    photoUrl: {
        type: String,
        required: true
    },
    authorId: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Author",
            required:false
        }
    ,
    locationAddress: {
        type: String,
        required: true
    },
    locationTitle: {
        type: String,
        required: true
    },
    location: {
        type: Object,
        required: true
    },
    startAt: {
        type: Number,
        required: true
    },
    endAt: {
        type: Number,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }
    ],
    price: {
        type: Number,
        required: true
    },
    ticketInventory: {
        type: Number,
    },
    followerCount: {
        type: Number,
        default: 0
    }
})
const EventModel = mongoose.model('Event', EventSchema)
module.exports = EventModel