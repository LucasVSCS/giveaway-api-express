const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../helpers/verify-token')

// Rotas de gerenciamento de credenciais
router.post('/verifyCredentials', userController.verifyCredentials)
router.post('/logout', userController.userLogout)
/****** FAZER 
router.post('/forgotPassword', userController.forgotPassword)
router.post('/editUser', userController.editUser)
********/

// Rotas de gerenciamento de usuários
router.get('/getUsers', verifyJWT, userController.getUsers)
router.post('/addUser', verifyJWT, userController.addUser)

module.exports = router
