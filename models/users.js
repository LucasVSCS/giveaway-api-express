const connection = require('../database/connection')
const generator = require('generate-password')
const moment = require('moment')
const crypto = require('crypto')
const mailController = require('../helpers/send-mail')

const getHashedPassword = password => {
  const sha256 = crypto.createHash('sha256')
  const hash = sha256.update(password).digest('base64')
  return hash
}

module.exports.getUsers = callback => {
  connection.query(
    'SELECT users.id, users.name, date_format(user_giveaway_details.beginning_period, "%d/%m/%Y") as beginning_period, date_format(user_giveaway_details.end_period, "%d/%m/%Y") as end_period, CASE WHEN user_giveaway_details.giveaway_permission = "S" THEN "Sim" ELSE "Não" END AS giveaway_permission, CASE WHEN user_login_details.user_type = "A" THEN "Administrador" ELSE "Comum" END as user_type FROM users INNER JOIN user_giveaway_details ON users.id = user_giveaway_details.user_id INNER JOIN user_login_details ON users.id = user_login_details.user_id;',
    (error, results) => {
      if (error) {
        console.log(error)
      } else {
        callback(null, results)
      }
    }
  )
}

module.exports.addUser = (newUser, callback) => {
  // TODO: FAZER O CHECK SE O USUÁRIO JÁ FOI REGISTRADO
  //Armazenando o retorno da requisição na nova variável
  newUser = newUser.body

  // Gerando uma nova senha para o usuário e armazenando em uma variável
  const originalPassword = generator.generate({
    length: 10,
    numbers: true
  })
  const password = getHashedPassword(originalPassword)

  let userId

  let beginningPeriod = moment(newUser.beginning_period).format('YYYY-MM-DD')
  let endPeriod = moment(newUser.end_period).format('YYYY-MM-DD')
  // Iniciando a conexão com o BD
  connection.getConnection((error, conn) => {
    // Iniciando a transaction do mysql
    conn.beginTransaction(err => {
      try {
        // Função para inserir a primeira parte do usuário no banco
        conn.query(
          'INSERT INTO users (name) VALUES (?)',
          [newUser.name],
          (error, results) => {
            userId = results.insertId
            if (error) {
              conn.rollback()
              callback({ message: 'Erro no sistema' }, null)
            } else {
              // Função para inserir a segunda parte do usuário no banco
              conn.query(
                'INSERT INTO user_login_details (email, password, user_type, user_id) VALUES (?, ?, ?, ?)',
                [newUser.email, password, newUser.user_type, userId],
                (error, results) => {
                  if (error) {
                    conn.rollback()
                    callback({ message: error }, null)
                  } else {
                    // Função para inserir a terceira parte do usuário no banco
                    conn.query(
                      'INSERT INTO user_giveaway_details (beginning_period, end_period, giveaway_permission, user_id) VALUES (?, ?, ?, ?)',
                      [
                        beginningPeriod,
                        endPeriod,
                        newUser.giveaway_permission,
                        userId
                      ],
                      (error, results) => {
                        if (error) {
                          conn.rollback()
                          callback({ message: 'Erro no sistema' }, null)
                        } else {
                          mailController.sendEmail(
                            newUser.email,
                            originalPassword
                          )
                          conn.commit()
                          callback(null, {
                            message: 'Sucesso ao cadastrar usuário'
                          })
                        }
                      }
                    )
                  }
                }
              )
            }
          }
        )
      } catch (err) {
        conn.rollback()
        callback({ message: 'Erro no sistema' }, null)
      } finally {
        connection.releaseConnection(conn)
      }
    })
  })
}

module.exports.editUserGiveawayData = (userData, callback) => {
  connection.query(
    'UPDATE user_giveaway_details SET beginning_period = ?, end_period = ?, giveaway_permission = ? WHERE user_id = ?',
    [
      userData.beginning_period,
      userData.end_period,
      userData.giveaway_permission,
      userData.id
    ],
    (error, results) => {
      if (error) {
        throw error
      } else {
        callback(null, results)
      }
    }
  )
}

module.exports.editUserPassword = (userData, callback) => {
  let password = getHashedPassword(userData.password)

  connection.query(
    'UPDATE user_login_details SET password = ? WHERE user_id = ?',
    [password, userData.userId],
    (error, results) => {
      if (error) {
        throw error
      } else {
        callback(null, results)
      }
    }
  )
}

module.exports.verifyCredentials = (credentialsData, callback) => {
  let password = getHashedPassword(credentialsData.body.userPassword)

  connection.query(
    'SELECT * FROM `gratidao-sorteador`.user_login_details WHERE email = ? and password = ?',
    [credentialsData.body.userEmail, password],
    (error, results) => {
      if (error) {
        throw error
      } else {
        if (results.length) {
          callback(null, results)
        } else {
          callback({ message: 'Nenhum usuário encontrado' }, null)
        }
      }
    }
  )
}

module.exports.deleteUser = (userId, callback) => {
  connection.getConnection((error, conn) => {
    conn.beginTransaction(err => {
      try {
        conn.query(
          'DELETE FROM `gratidao-sorteador`.user_giveaway_details WHERE user_id = ?',
          [userId.body.userId],
          (error, results) => {
            if (error) {
              conn.rollback()
              callback({ message: error }, null)
            } else {
              conn.query(
                'DELETE FROM `gratidao-sorteador`.user_login_details WHERE user_id = ?',
                [userId.body.userId],
                (error, results) => {
                  if (error) {
                    conn.rollback()
                    callback({ message: error }, null)
                  } else {
                    conn.query(
                      'DELETE FROM `gratidao-sorteador`.users WHERE id = ?',
                      [userId.body.userId],
                      (error, results) => {
                        if (error) {
                          conn.rollback()
                          callback({ message: 'Erro no sistema' }, null)
                        } else {
                          conn.commit()
                          callback(null, {
                            message: 'Sucesso ao deletar o usuário'
                          })
                        }
                      }
                    )
                  }
                }
              )
            }
          }
        )
      } catch (err) {
        conn.rollback()
        callback({ message: 'Erro no sistema' }, null)
      } finally {
        connection.releaseConnection(conn)
      }
    })
  })
}
