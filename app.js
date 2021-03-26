//Definindo as dependências do projeto
require('dotenv-safe').config()
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
var helmet = require('helmet')
var bodyParser = require('body-parser')
var router = express.Router()

//Definindo as rottas
var usersRouter = require('./routes/users')
var giveawayRouter = require('./routes/giveaways')

//Definindo o express
var app = express()

app.use(logger('dev'))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/giveaways', giveawayRouter)

module.exports = router

module.exports = app
