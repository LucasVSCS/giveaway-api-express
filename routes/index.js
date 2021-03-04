var express = require('express')
var axios = require('axios')
var router = express.Router()

/* GET home page. */
router.get('/teste', function (req, res) {
  axios.get('https://www.instagram.com/p/CLvcI94ntYm/?__a=1').then(response => {
    res.send(response.data)
  })
})

module.exports = router
