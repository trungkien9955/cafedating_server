const asyncHandler = require('express-async-handler');
const CafeModel = require('../src/models/cafeModel');
const { calcDistance } = require('./mapController');

 const addCafes = asyncHandler(async(req, res)=>{
    const {cafes } = req.body
    if(cafes.length>0){
        try {
            await Promise.all(cafes.map(async(item)=>{
                const cafe = await CafeModel.findOne({placeId: item.placeId}).lean()
                if(!cafe){
                    console.log('add cafes')

                    const newCafe = new CafeModel({name: item.name??'', geometry: item.geometry??{},formattedAddress: item.formattedAddress??'', photoReference:item.photoList.length>0?item.photoList[0].photo_reference:'', placeId:item.placeId??'', rating:item.rating??0, reference:item.reference ??'', types: item.types??[], userRatingsTotal:item.userRatingsTotal??0});
                    await newCafe.save()

                            }
               }))
        } catch (error) {
            console.log(error)
        }
    }
    res.status(200).json({msg:'Success'})
 })
 const fetchCafes = asyncHandler(async(req, res)=>{
    console.log('fetchCafes')
    const {position} = req.body
    const cafes = await CafeModel.find().lean()
    let nearbyCafes = []
    if(cafes.length>0){
        cafes.forEach((item)=>{
            
            // const distance = calcDistance({userLat:position.latitude, userLong:position.longtitude, personLat:item.geometry.location.lat, personLong:item.geometry.location.lng})
            const distanceData = calcDistance({
                userLat: position.latitude,
                userLong: position.longitude, 
                personLat: item.geometry.location.lat,
                personLong: item.geometry.location.lng
            }).toFixed(1)
            // console.log(distanceData)
            if(distanceData< 2){
                const cafeItem = {...item, distance: distanceData}
                nearbyCafes.push(cafeItem)
            }
        })
    }
    
    res.status(200).json({msg:'Success', data: nearbyCafes})
 })
 const toggleBookmark = asyncHandler(async(req, res)=>{
    console.log('toogleBookmark')
    const {placeId} = req.body
    const {userId} = req.query
    if(!placeId || !userId){
        return res.status(401).json({msg: 'Data not found'})
    }
    const cafe = await CafeModel.findOne({placeId:placeId}).lean()
    console.log(cafe.bookmarkers)
    console.log(userId)
    if(!cafe.bookmarkers.some((id)=>id.equals(userId))){
        await CafeModel.findOneAndUpdate({placeId: placeId}, {$push:{'bookmarkers': userId}})

    }else{
        await CafeModel.findOneAndUpdate({placeId: placeId}, {$pull:{'bookmarkers': userId}})

    }
   
    res.status(200).json({msg:'Success'})
 })
 module.exports={addCafes, fetchCafes, toggleBookmark}