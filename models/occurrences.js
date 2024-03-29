const connection = require('../database/connection')

module.exports.getOccurrences = callback => {
  connection.query(
    'SELECT occurrences.id, occurrences.description, DATE_FORMAT(occurrences.occurrence_date, "%d/%m/%Y %H:%i:%s") AS occurrence_date, users.name  FROM `gratidao-sorteador`.occurrences inner join `gratidao-sorteador`.users ON occurrences.user_id = users.id',
    (error, results) => {
      if (error) {
        console.log(error)
      } else {
        callback(null, results)
      }
    }
  )
}

module.exports.addOccurrence = occurenceData => {
  connection.query(
    'INSERT INTO occurrences (description, occurrence_date, user_id) VALUES (?, NOW(), ?)',
    [occurenceData.description, occurenceData.userId],
    (error, results) => {
      if (error) {
        throw error
      } else {
        return true
      }
    }
  )
}
