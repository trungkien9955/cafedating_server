const express = require('express')
const cors = require('cors')
require('dotenv').config()
const authRouter = require('./eee/routers/authRouter')
const connectDB = require('./configs/connectDb')
const errorHandler = require('./middlewares/errorMiddleware')
const userRouter = require('./eee/routers/userRouter')
const { verifyToken } = require('./middlewares/verifyMiddleware')
const eventRouter = require('./eee/routers/eventRouter')
const dataRouter = require('./eee/routers/dataRouter')
const mapRouter = require('./eee/routers/mapRouter')
const cafeRouter = require('./eee/routers/cafeRouter')
const app = express()
// app.use(cors())
app.use(express.json())
app.get('/auth/hello', (_req, res)=>{
    res.send('<h1>Welcome to cafe dating server!</h1>')
})
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/events', verifyToken, eventRouter)
app.use('/data', dataRouter)
app.use('/map', mapRouter)
app.use('/cafe', cafeRouter)
connectDB()
app.use(errorHandler)
app.listen(process.env.PORT, error=>{
    if (error) {
        console.log(error)
        return
    }
    console.log(`Server is running at http://localhost:${process.env.PORT}`)
})

