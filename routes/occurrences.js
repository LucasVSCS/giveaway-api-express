const express = require('express')
const router = express.Router()
const occurrenceController = require('../controllers/occurrenceController')
const verifyJWT = require('../helpers/verify-token')

router.get('/getOccurrences', verifyJWT, occurrenceController.getOccurrences)

module.exports = router
