const asyncHandler = require('express-async-handler')
const UserModel = require('../src/models/userModel')
const EventModel = require('../src/models/eventModel')
const BillModel = require('../src/models/billModel')
const AuthorModel = require('../src/models/authorModel')
const { default: mongoose } = require('mongoose')

const addEvent = asyncHandler(async(req, res)=>{
    const functionName='addEvent'
    const body = req.body
    if(body){
        // const event = {...body, startAt: Date.parse(body.startAt), endAt: Date.parse(body.endAt), date:Date.parse(body.date)}
        const eventData = {
            title: body.title,
            description: body.description,
            authorId: body.authorId,
            startAt: Date.parse(body.startAt),
            endAt: Date.parse(body.endAt),
            date: Date.parse(body.date),
            photoUrl: body.photoUrl,
            location: {
                lat: body.location.lat,
                long: body.location.long,
            },
            locationTitle: body.locationTitle,
            locationAddress: body.locationAddress,
            followers: [], 
            categories: body.categories,
            price: parseInt(body.price),
            ticketInventory: 999
        }
        const newEvent = new EventModel(eventData)
        try {
            await newEvent.save()
            res.status(200).json({
                message: 'Event added successfully',
                data: []
            })
        } catch (error) {
            console.log(functionName, error)
            res.status(403).json({
                message: 'Cannot add event'
            })
        }
    }else{
        res.status(401).json({
            message: 'Event data not found',
        })
    }
})



module.exports={}