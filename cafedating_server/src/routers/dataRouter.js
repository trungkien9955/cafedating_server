const Router = require('express')
const { addCategories, updateDb, getInterests, getCities, getHometowns } = require('../../controllers/dataController')
const dataRouter = Router()

dataRouter.get('/add-categories', addCategories)
dataRouter.get('/update-db', updateDb)
dataRouter.get('/interests', getInterests)
dataRouter.get('/cities', getCities)
dataRouter.get('/hometowns', getHometowns)



module.exports = dataRouter