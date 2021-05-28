const occurrenceModel = require('../models/occurrences')

const occurrenceController = {
  getOccurrences (req, res) {
    occurrenceModel.getOccurrences((err, data) => {
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
  }
}

module.exports = occurrenceController
