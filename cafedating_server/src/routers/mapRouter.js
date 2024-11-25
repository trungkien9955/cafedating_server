const Router = require('express')
const { getNearbyPersons, getPersonProfile } = require('../../controllers/mapController')

const mapRouter = Router()

// userRouter.get('/get-all', getAllUsers)
mapRouter.get('/nearby-persons', getNearbyPersons)
mapRouter.post('/person-profile', getPersonProfile)

module.exports=mapRouter