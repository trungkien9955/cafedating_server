const mongoose = require('mongoose')
const jobSchema = new mongoose.Schema({
    name:{
        required: true,
        type:String
    }
})
const JobModel = mongoose.model('Job', jobSchema)
module.exports = JobModel