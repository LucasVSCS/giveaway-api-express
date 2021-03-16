var express = require('express')
var router = express.Router()
var userController = require('../controllers/userController')

router.get('/getUsers', userController.getUsers)
router.post('/addUser', userController.addUser)

module.exports = router
