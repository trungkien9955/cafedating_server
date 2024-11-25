const asyncHandler = require('express-async-handler')
const UserModel = require('../eee/models/userModel')
const EventModel = require('../eee/models/eventModel')
const { default: mongoose } = require('mongoose')
require('dotenv').config()
const FcmTokenModel = require('../eee/models/FcmTokenModel');
const jwt = require('jsonwebtoken')
const CollegeModel = require('../eee/models/collegeModel')
const CityModel = require('../eee/models/cityModel')
const HometownModel = require('../eee/models/hometownModel')
const { query } = require('express')
const {JWT, google, auth, GoogleAuth} = require('google-auth-library');
const { default: axios } = require('axios')
const NotiModel = require('../eee/models/notiModel')

const generateToken = (string)=>{
    const jwtKey = process.env.SECRET_KEY
    return jwt.sign({string}, jwtKey, {expiresIn:'3m'})
}
const login = async(req, res)=>{
    const email = req.query.email
    try {
        const userData = await UserModel.findOne({email: email}).lean();
        console.log(`login ${userData} ${email}`)
    const user = {
        uid: userData.uid,
        id: userData._id,
        accessToken: userData.accessToken,
        name: userData.name,
        photoUrl: userData.photoUrl,
    }
    if(user){
         res.status(200).json({
            code: 200,
            msg: 'Đăng nhập thành công',
            data: user
         })
    }else{
         res.status(401).json({
            code: 401,
            msg: 'Không tìm thấy người dùng'
        })
    }
    } catch (error) {
        res.status(500).json({
            code: 500,
            msg: 'Lỗi máy chủ'
        })
    }
    
}
const register = asyncHandler(async(req, res)=>{
    const functionName='register'
    const {data} = req.body
    const {uid} = req.query
    console.log(uid,data.name)
    if(!data){
        return res.status(401).json({msg:'register failed'})
    }
    let accessToken=''
    if(uid){
         accessToken = generateToken(uid)
    }
    // const newUser = new UserModel({uid: uid,name: data.name, email:data.email, photoUrl: 'https://firebasestorage.googleapis.com/v0/b/cafedating-c83ae.appspot.com/o/default-avatar-2?alt=media&token=738cb5ce-44c7-4209-a973-81d66389c91f',accessToken: accessToken,gender:data.gender,city:data.cityId, status: 'unverified'})
    console.log(newUser)
    await newUser.save()
     res.status(200).json(
        {
            code: 200,
            msg: 'Tạo tài khoản thành công'
        }
     )
    
})
const getActivities = (req, res)=>{
    const activities = 
        {
            key: '1',
            activity: 'Walking',
            type:'sport',
            participants: 20,
            price:2
        }
    
    res.status(200).json(activities)
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
    console.log(lat, long, distance)
    const persons = await UserModel.find()
    if(persons.length >0) {
        const nearbyPersons = []
        persons.forEach((person)=> {
            const distanceData = calcDistance({
                userLong: long,
                userLat: lat, 
                personLat: person.position.lat,
                personLong: person.position.long
            })
            console.log(distanceData)
            if(eventDistance < distance){
                nearbyPersons.push(person)
            }
        })
        console.log(nearbyPersons)
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
const getSelectedInterests = async(req, res)=>{
    const {userId} =  req.query
    const userData = await UserModel.findById(userId).select('interests');
    const selectedInterestIds = userData.interests
    // console.log(selectedInterestIds)
    if(!selectedInterestIds){
        return res.status(401).json({
            msg: 'Không tìm thấy người dùng'
        })
    }
    res.status(200).json({
        msg: 'Success',
        data: selectedInterestIds
    })
}
const getUserInterests = async(req, res)=>{
    console.log('get users interests')
    const {userId} =  req.query
    const userData = await UserModel.findById(userId).populate('interests');
    const userInterests = userData.interests
    // console.log(userInterests)
    if(!userInterests){
        return res.status(401).json({
            msg: 'Không tìm thấy người dùng'
        })
    }
    res.status(200).json({
        msg: 'Success',
        data: userInterests
    })
}
const updateSelectedInterests = asyncHandler(async(req, res)=>{
    const {userId} =  req.query
    const selectedInterests = req.body
    // console.log(req.body)
    // console.log(userId)
    await UserModel.findByIdAndUpdate({_id: userId}, {$set: {interests: selectedInterests}})
    res.status(200).json({
        msg: 'Đã cập nhật sở thích',
        data: selectedInterests
    })
})
const searchColleges = asyncHandler(async(req, res)=> {
    const {searchKey} = req.query
    console.log(`search colleges ${searchKey}`)
    // let regexQuery = "^"+searchKey
        const collegesData = await CollegeModel.find({name: {$regex: searchKey, $options: "i"}});
        let colleges=[]
        if(collegesData.length>0){
            collegesData.forEach((item)=>colleges.push({id: item._id, name: item.name}))
        }
        res.status(200).json({msg: 'Success', data: colleges})
    
})
const updateCollege = asyncHandler(async(req, res)=> {
    const {userId} = req.query
    const {collegeId} = req.body
    if(!userId || !collegeId){
        return res.status(401).json({msg: 'Không tìm thấy id người dùng hoặc trường'})
    }
    // let regexQuery = "^"+searchKey
        await UserModel.updateOne({_id:userId}, {$set:{'college': collegeId}})
        res.status(200).json({msg: 'Success'})
    
})
const getCollege = asyncHandler(async(req, res)=> {
    const {userId} = req.query
    console.log(userId);
    if(!userId){
        return res.status(401).json({msg: 'Không tìm thấy id người dùng'})
    }
       const userData =  await UserModel.findById(userId).populate('college').lean();
        const collegeData = userData.college
        const college = {id: collegeData._id, name: collegeData.name}
        console.log(college);
        res.status(200).json({msg: 'Success', data:college})
    
})
const updatePhotoUrl = asyncHandler(async(req, res)=> {
    console.log('update photo url')
    const {userId} = req.query
    const {photoUrl} = req.body
    console.log(photoUrl)
    if(!userId || !photoUrl){
        return res.status(401).json({msg: 'Không tìm thấy id người dùng hoặc url'})
    }
    // let regexQuery = "^"+searchKey
        await UserModel.updateOne({_id:userId}, {$set:{'photoUrl': photoUrl}})
        res.status(200).json({msg: 'Success'})
    
})
const getPhotoUrl = asyncHandler(async(req, res)=> {
    console.log('get photo url')
    const {userId} = req.query
    if(!userId){
        return res.status(401).json({msg: 'Không tìm thấy id người dùng'})
    }
    // let regexQuery = "^"+searchKey
       const userData =  await UserModel.findById(userId).select('photoUrl').lean();
       const photoUrl = userData.photoUrl

        res.status(200).json({msg: 'Success', data: photoUrl})
    
})
const changeName = asyncHandler(async(req, res)=> {
    const {userId} = req.query
    const {newName} = req.body
    console.log(`change name ${newName}`);
    if(!userId||newName==''){
        return res.status(401).json({msg: 'Không tìm thấy id người dùng hoặc tên bị để trống'})
    }
    // let regexQuery = "^"+searchKey
        await UserModel.findOneAndUpdate({'_id':userId},{$set:{'name':newName}});

        res.status(200).json({msg: 'Success', data: newName})
    
})
const pushNotification = asyncHandler(async(req, res)=>{
    const functionName = 'pushNotification'
    const {data} = req.body
    const {senderId, receiverId, type} = req.query
    console.log(functionName, type, data, senderId, receiverId)

    if(type === 'friend-request'){
        try {
                const fcmToken = await FcmTokenModel.findOne({userId:receiverId, status:'active'}).lean()
            if(fcmToken){
                const notificationData = {type, senderId, receiverId, data}
                    await sendNotification(fcmToken.name,  notificationData)}
            res.status(200).json({
                message: 'Đã gửi lời mời...',
            })
            
        } catch (error) {
            res.status(401).json({functionName, error: 'error'})
            console.log(functionName, error.message)
        }
    }
    
})
const sendNotification = async(token,  notificationData)=>{
    const functionName = 'sendNotification'
    const accessToken = await getNotiAccessToken()

    let requestBody = JSON.stringify({
        message: {
            token: token,
            notification: {
                body: notificationData.data.subTitle,
                title: notificationData.data.title
            }
        }
    })
    // console.log(functionName, requestBody)
    const config = {
        method: 'post', 
        url: process.env.FIREBASE_MESSAGING_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        data: requestBody
    }
     axios.request(config)
    .then(async(response) => {
        const newNoti = new NotiModel({
            type:notificationData.type,
           senderId: notificationData.senderId,
           receiverId: notificationData.receiverId,
            title: notificationData.data.title,
            body: notificationData.data.subTitle,
            isRead:false, 
        })
        await newNoti.save()
    })
    .catch((error) => {
    console.log(functionName,error);
    });
}
const getNotiAccessToken= ()=> {
    return new Promise(function(resolve, reject) {
    //   const key = require('../eee/cafedating-c83ae-firebase-adminsdk-68eua-c9531dbddb.json');
      const jwtClient = new JWT(
        key.client_email,
        null,
        key.private_key,
        ['https://www.googleapis.com/auth/cloud-platform'],
        null
      );
      jwtClient.authorize(function(err, tokens) {
        if (err) {
          reject(err);
          return;
        }
        resolve(tokens.access_token);
      });
    });
  }
//   function getNotiAccessToken() {
//     return new Promise(function(resolve, reject) {
//       const key = require('../src/cafedating-c83ae-firebase-adminsdk-68eua-c9531dbddb.json');
//       const jwtClient = new GoogleAuth.auth.JWT(
//         key.client_email,
//         null,
//         key.private_key,
//         SCOPES,
//         null
//       );
//       jwtClient.authorize(function(err, tokens) {
//         if (err) {
//           reject(err);
//           return;
//         }
//         resolve(tokens.access_token);
//       });
//     });
//   }
const updateFcmToken = asyncHandler(async(req,res)=>{
    const {fcmToken, userId} = req.body
    console.log(fcmToken, userId)
    if(!fcmToken ||!userId){
        return res.status(401).json('fcm token or userid not found')
    }
   const fcmTokenData =  await FcmTokenModel.findOne({name: fcmToken, userId: userId, status:'active'}).lean();
    if(!fcmTokenData){
        const newFcmToken = new FcmTokenModel({name: fcmToken, userId: userId,status: 'active'})
        await newFcmToken.save()
    }
    res.status(200).json({msg: 'update fcm token successfully'})

})
const searchUsers = asyncHandler(async(req, res)=>{
    const {searchFilter} = req.body
    console.log(`searchUsers ${searchFilter}`)
    let query = {gender: searchFilter.gender}
    query = {...query,  position : { $exists: true, $ne: null } }
    if(searchFilter.cityId !== ''){
        query = {...query, cityId: searchFilter.cityId}
    }
    if(searchFilter.hometownId !== ''){
        query = {...query, hometownId: searchFilter.hometownId}
    }
    if(searchFilter.hometownId !== ''){
        query = {...query, jobId: searchFilter.jobId}
    }
    const users = await UserModel.find(query).populate([{
        path:'city',
        model:'City'
    },{
        path:'hometown',
        model: 'Hometown'
    }]).lean().exec()
    console.log(users)
    let nearUsers = []
    users.forEach((item)=>{
        let distance = calcDistance({
            userLat: searchFilter.position.lat,
            userLong: searchFilter.position.lng,
            personLat:item.position.lat,
            personLong:item.position.long
        })
        
        if (distance<500){
            distance=distance.toFixed(1)
            // console.log(distance)
            let user = {...item, distance: distance}
            // console.log('search users',user)
            nearUsers.push(user)
        }
    })
    res.status(200).json({msg:'success', data: nearUsers})
})
const getNotis = asyncHandler(async(req,res)=>{
    const {userId} = req.query
    if(!userId){
        return res.status(401).json({msg:'user id not found'})
    }
    const notis = await NotiModel.find({receiverId: userId}).populate('senderId').lean()
    // console.log(notis)
    res.status(200).json({msg:'success', data: notis})
})
const markNotiAsRead = asyncHandler(async(req,res)=>{
    const {id} = req.query
    if(!id){
        return res.status(401).json({msg:'id not found'})
    }
     await NotiModel.findByIdAndUpdate(id, {isRead:true})
    res.status(200).json({msg:'success'})
})
const acceptFriendRequest = asyncHandler(async(req,res)=>{
    const {id, senderId, receiverId} = req.body.data
    console.log('accept friend request', id, senderId, receiverId)
    if(!id||!senderId||!senderId){
        return res.status(401).json({msg:'data not found'})
    }
     await NotiModel.findByIdAndUpdate(id, {type:'friend-request-accepted', isRead:true})
     await UserModel.findByIdAndUpdate(senderId, {$push:{friends: receiverId}})
     await UserModel.findByIdAndUpdate(receiverId, {$push:{friends: senderId}})
    res.status(200).json({msg:'success'})
})
const updatePostion = asyncHandler(async(req,res)=>{
    // console.log('update position')
    const {userId} = req.query
    const {position} = req.body
    console.log(position, userId)
    // console.log(req.query, req.body)
    if(!userId || !position){
        return res.status(401).json({msg: 'update position failed'})

    }
    const userData = await UserModel.findById(userId).lean()
    if(!userData){
        return res.status(401).json({msg: 'user not found'})

    }
    await UserModel.findByIdAndUpdate(userId, {position: position}) 
    res.status(200).json({msg: 'update position successfully'})

})
const calcDistance = ({userLat, userLong, personLat, personLong})=>{
    const toRoad = (val)=> val * Math.PI/180
    const r = 6371
    const dLat = toRoad(personLat - userLat)
    const dLong = toRoad(personLong - userLong)
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLong/2) * Math.sin(dLong/2)* Math.cos(toRoad(userLat)) * Math.cos(toRoad(personLat))
    return r*(2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a)))
}
module.exports={login, register, getActivities, getPersons, getNearbyPersons, getSelectedInterests, updateSelectedInterests, getUserInterests, searchColleges, updateCollege, getCollege, updatePhotoUrl, getPhotoUrl, changeName, pushNotification, updateFcmToken, searchUsers, getNotis, markNotiAsRead, acceptFriendRequest, updatePostion}