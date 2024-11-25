const mongoose = require('mongoose')
const interestSchema = new mongoose.Schema({
    name:{
        required: true,
        type:String
    },
    type:{
        required: true,
        type:String
    },
})
const InterestModel = mongoose.model('Interest', interestSchema)
module.exports = InterestModel