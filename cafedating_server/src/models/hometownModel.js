const mongoose = require('mongoose')
const hometownSchema = new mongoose.Schema({
    name:{
        required: true,
        type:String
    }
})
const HometownModel = mongoose.model('Hometown', hometownSchema)
module.exports = HometownModel