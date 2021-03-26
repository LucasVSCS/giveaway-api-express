const express = require('express')
const router = express.Router()
const giveawayController = require('../controllers/giveawayController')
const verifyJWT = require('../helpers/verify-token')

// Rotas de gerenciamento de sorteios
router.post('/newGiveaway', verifyJWT, giveawayController.newGiveaway)
//router.post('/listGiveaway', verifyJWT, userController.addUser)

module.exports = router
