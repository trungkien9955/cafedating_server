const mongoose = require('mongoose')
const cafeSchema = new mongoose.Schema({
    name:{
        required: true,
        type:String
    },
    geometry:{
        required: true,
        type:Object
    },
    formattedAddress:{
        required: false,
        type:String
    },
    photoReference:{
        required: false,
        type:String
    },
    placeId:{
        required: true,
        type:String
    },
    rating:{
        required: true,
        type:Number
    },
    reference:{
        required: true,
        type:String
    },
    types:{
        required: true,
        type:Array
    },
    userRatingsTotal:{
        required: true,
        type:Number
    },
    bookmarkers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
})
const CafeModel = mongoose.model('Cafe', cafeSchema)
module.exports = CafeModel