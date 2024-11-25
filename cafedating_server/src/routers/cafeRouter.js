const Router = require('express')
const { addCafes, fetchCafes, toggleBookmark } = require('../../controllers/cafeController')

const cafeRouter = Router()

// userRouter.get('/get-all', getAllUsers)
cafeRouter.post('/add-cafes', addCafes)
cafeRouter.post('/fetch-cafes', fetchCafes)
cafeRouter.post('/toggle-bookmark', toggleBookmark)

module.exports=cafeRouter