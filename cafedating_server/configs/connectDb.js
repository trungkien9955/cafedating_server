const { default: mongoose } = require('mongoose')

require('dotenv').config()

const dbUrl =`mongodb+srv://trungkien88992020:${process.env.DATABASE_PASSWORD}@cluster0.kdkgo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
console.log(dbUrl)

const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(dbUrl)
        console.log(connection.connection.host)
    } catch (error) {
        console.log(error)
        process.exit()
    }
}
module.exports = connectDB