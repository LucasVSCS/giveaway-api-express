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
    res.clearCookie('token').sendStatus(200)
  },
  forgotPassword (req, res) {
    // Placeholder pra fazer dps a parte de esqueci minha senha
  },
  verifyUserSession (req, res) {
    if (req.cookies.token) {
      jwt.verify(req.cookies.token, process.env.SECRET, (err, decoded) => {
        if (err) {
          return res
            .status(500)
            .json({ auth: false, message: 'Failed to authenticate token.' })
        }

        res.json({
          auth: true,
          userId: decoded.userId,
          userType: decoded.userType
        })
      })
    }

    res.status(401).send({ message: 'Usuário não autorizado' })
  }
}

module.exports = userController
