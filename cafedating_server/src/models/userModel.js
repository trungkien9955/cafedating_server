const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    familyName: {
        type: String,
        required: false
    },
    givenName: {
        type: String,
        required: false
    },
    gender: {
        type: String
    },
    bio: {
        type: String
    },
    photoUrl: {
        type: String,
        required: false,
        default: ''
    },
    position: {
        type: Object,
        required: false
    },
    job: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job"
        }
    ],
    interests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interest"
        }
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    college: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College"
        }
    ,
    hometown: {
type: mongoose.Schema.Types.ObjectId,
            ref: "City"
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
            ref: "Hometown"
    },
    lastSeen: {
        type:Date
    },
    profileColor: {
        required: false,
        type: String,
        default: '#9C27B0'
    },
    status: {
        required: false,
        type: String,
        default: 'active'
    },
    accessToken: {
        required: false,
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})
const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel