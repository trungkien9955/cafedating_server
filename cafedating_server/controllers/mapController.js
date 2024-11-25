const asyncHandler = require('express-async-handler')
const UserModel = require('../src/models/userModel')
const EventModel = require('../src/models/eventModel')
const { default: mongoose } = require('mongoose')
require('dotenv').config()
const FcmTokenModel = require('../src/models/FcmTokenModel');
const jwt = require('jsonwebtoken')
const generateToken = (string)=>{
    const jwtKey = process.env.SECRET_KEY
    return jwt.sign({string}, jwtKey, {expiresIn:'3m'})
}

const getPersons = (req, res)=>{
    const persons = 
        [
            {
            personInfo: {name: 'Harry', age: 24, job:'Accountant'},
            interests: ['Walking', 'Travel'],
            },
            {
            personInfo: {name: 'Jane', age: 22, job:'Model'},
            interests: ['Movie', 'Event'],
            },
        ]   
    
    res.status(200).json({msg:'Success', persons})
}
const getNearbyPersons = async(req, res)=>{
    const {lat, long, distance} = req.query
    const persons = await UserModel.find({ position : { $exists: true, $ne: null } })
    if(persons.length >0) {
        const nearbyPersons = []
        persons.forEach((person)=> {
            const distanceData = calcDistance({
                userLong: parseFloat(lat),
                userLat: parseFloat(long), 
                personLat: person.position.lat,
                personLong: person.position.long
            })
            // console.log(distanceData)
            if(distanceData < 15000){
                nearbyPersons.push({
                    id: person._id,
                    name: person.name??'',
                    position: person.position,
                    photoUrl: person.photoUrl??'',
                    age: 20
                })
            }
        })
        console.log('nearbyPersons', nearbyPersons.length)
        res.status(200).json({
            message: 'get persons successfully',
            data: nearbyPersons
        })
    }else{
        res.status(401).json({
            message: 'getting persons failed',
            data: undefined
        })
    }
}
const getPersonProfile = asyncHandler(async(req, res)=>{

    const {userId} = req.query
    // console.log(userId)
    if(!userId){
        return res.status(401).json({msg: 'get person profile failed'})
    }
    const userData = await UserModel.findById(userId).populate(['city','hometown','interests','college']).lean()
    console.log(userData.name);
    res.status(200).json({msg: 'Success', data: userData})
})
const calcDistance = ({userLat, userLong, personLat, personLong})=>{
    const toRoad = (val)=> val * Math.PI/180
    const r = 6371
    const dLat = toRoad(personLat - userLat)
    const dLong = toRoad(personLong - userLong)
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLong/2) * Math.sin(dLong/2)* Math.cos(toRoad(userLat)) * Math.cos(toRoad(personLat))
    return r*(2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a)))
}
module.exports={ getPersons, getNearbyPersons, calcDistance, getPersonProfile}