var express = require('express')
var router = express.Router()
var userController = require('../controllers/userController')

/* GET users listing. */
//router.get('/getUsers', userController.getUsers)

router.get('/getUsers', (req, res) => {
  var db = req.dataBase

  db.query('SELECT * FROM `users`', (error, results, fields) => {
    res.send(results)
  })
})

module.exports = router
