const { default: mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
    description: {
        type: String,
        required: false
    }
})
const CategoryModel = mongoose.model('Category', categorySchema)
module.exports = CategoryModel