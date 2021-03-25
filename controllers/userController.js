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
          const userId = data.user_id
          const userType = data.user_type

          // Setando o JWT
          const token = jwt.sign({ userId, userType }, process.env.SECRET)

          res.json({ auth: true, token: token })
        }
      } catch (error) {
        res.status(500).send(error)
      }
    })
  },

  userLogout (req, res) {
    res.json({ auth: false, token: null })
  }
}

module.exports = userController
