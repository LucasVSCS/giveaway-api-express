var express = require('express')
var router = express.Router()
var userController = require('../controllers/userController')

/* GET users listing. */
router.get('/', function (req, res, next) {
  axios
    .get('https://www.instagram.com/p/CLvcI94ntYm/?__a=1')
    .then(function (response) {
      console.log(response)
    })
})

module.exports = router
