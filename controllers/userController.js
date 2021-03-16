const userModel = require('../models/users')

const userController = {
  getUsers (req, res) {
    userModel.getUsers((err, data) => {
      try {
        if (err) {
          console.log(err)
        } else if (data) {
          res.send(data)
        }
      } catch (error) {
        console.log(error)
      }
    })
  },

  addUser (req, res) {
    userModel.addUser(req, (err, data) => {
      try {
        if (err) {
          console.log(err)
        } else if (data) {
          res.send(data)
        }
      } catch (error) {
        console.log(error)
      }
    })
  }
}

module.exports = userController
