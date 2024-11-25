const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyToken = asyncHandler((req, res, next)=>{
    const accessToken = req.headers.authorization
    const token = accessToken && accessToken.split(' ')[1]
    if(!token){
        res.status(401)
        throw new Error('Unauthorized')
    }else{
        const verify = jwt.verify(token, process.env.SECRET_KEY)
        if(verify){
            next()
        }else{
            res.status(403)
            throw new Error('Invalid access token')
        }
    }})
module.exports={verifyToken}