const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../helpers/verify-token')

// Rotas de gerenciamento de credenciais
router.post('/verifyCredentials', userController.verifyCredentials)
router.get('/logout', userController.userLogout)
router.post('/verifyJWT', userController.verifyUserSession)
router.post('/changePassword', userController.changePassword)
/****** FAZER 
router.post('/forgotPassword', userController.forgotPassword)
router.post('/editUser', userController.editUser)
********/

// Rotas de gerenciamento de usuários
router.get('/getUsers', verifyJWT, userController.getUsers)
router.post('/addUser', verifyJWT, userController.addUser)
router.post('/deleteUser', verifyJWT, userController.deleteUser)

module.exports = router
