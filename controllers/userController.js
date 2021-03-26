const jwt = require('jsonwebtoken')
const userModel = require('../models/users')

const userController = {
  getUsers (req, res) {
    userModel.getUsers((err, data) => {
      try {
        if (err) {
          res.status(500).send(err)
        } else if (data) {
          res.send(data)
        }
      } catch (error) {
        res.status(500).send(error)
      }
    })
  },

  addUser (req, res) {
    userModel.addUser(req, (err, data) => {
      try {
        if (err) {
          res.status(500).send(err)
        } else if (data) {
          res.send(data)
        }
      } catch (error) {
        res.status(500).send(error)
      }
    })
  },

  verifyCredentials (req, res) {
    userModel.verifyCredentials(req, (err, data) => {
      try {
        if (err) {
          res.status(500).send(err)
        } else if (data) {
          // Retornando o ID do usuário e seu tipo
          const userId = data[0].user_id
          const userType = data[0].user_type

          // Setando o JWT
          const token = jwt.sign({ userId, userType }, process.env.SECRET)

          res.cookie('token', token, { httpOnly: true }).sendStatus(200)
        }
      } catch (error) {
        res.status(500).send(error)
      }
    })
  },

  userLogout (req, res) {
    res.json({ auth: false, token: null })
  },
  forgotPassword (req, res) {}
}

module.exports = userController
