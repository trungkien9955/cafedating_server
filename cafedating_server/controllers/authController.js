const UserModel = require("../src/models/userModel")
const bcrypt = require('bcrypt')
const randomstring = require("randomstring");

require('dotenv').config()
const jwt = require('jsonwebtoken')
const getJsonWebToken = (email,  id) => {
    const payload = {email, id}
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '7d'
    })
    return token
}
const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')
const FcmTokenModel = require("../src/models/FcmTokenModel")
require('dotenv').config()
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
const register = asyncHandler(async(req, res)=> {
    const functionName = 'register'
    const {familyName, givenName, email, password} = req.body
    console.log(functionName, req.body)
    const existingUser = await UserModel.findOne({email}).lean()
    if(existingUser){
        res.status(401)
        throw new Error('Email already exists.')
    }
    //generate hashed password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new UserModel({
        email,
        familyName: familyName ? familyName: '',
        givenName: givenName??'',
        password: hashedPassword
    })
   const createdUser = await newUser.save()
    const userData = createdUser._doc
    userData.accessToken =  getJsonWebToken(userData.email, userData._id)
    userData.id = createdUser._id
    let returnedUser = {...userData, password: null}
    res.status(200).json({
        message: 'User created successfully.',
        data: returnedUser
    }) 
})

module.exports = {register}