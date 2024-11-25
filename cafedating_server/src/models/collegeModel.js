const mongoose = require('mongoose')
const collegeSchema = new mongoose.Schema({
    name:{
        required: true,
        type:String
    }
})
const CollegeModel = mongoose.model('College', collegeSchema)
module.exports = CollegeModel