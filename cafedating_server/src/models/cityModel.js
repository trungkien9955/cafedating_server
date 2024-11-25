const mongoose = require('mongoose')
const citySchema = new mongoose.Schema({
    name:{
        required: true,
        type:String
    }
})
const CityModel = mongoose.model('City', citySchema)
module.exports = CityModel