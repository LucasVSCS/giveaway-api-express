const connection = require('../database/connection')
const generator = require('generate-password')
const crypto = require('crypto')

const getHashedPassword = password => {
  const sha256 = crypto.createHash('sha256')
  const hash = sha256.update(password).digest('base64')
  return hash
}

module.exports.getUsers = callback => {
  connection.query(
    'SELECT users.id, users.name, users.user_type, user_giveaway_details.beginning_period, user_giveaway_details.end_period, user_giveaway_details.giveaway_permission FROM users inner join user_giveaway_details WHERE users.id = user_giveaway_details.user_id;',
    (error, results, fields) => {
      if (error) {
        console.log(error)
      } else {
        callback(null, results)
      }
    }
  )
}

module.exports.addUser = async (newUser, callback) => {
  //Armazenando o retorno da requisição na nova variável
  newUser = newUser.body

  // Gerando uma nova senha para o usuário e armazenando em uma variável
  let password = generator.generate({
    length: 10,
    numbers: true
  })
  password = getHashedPassword(password)

  // Check if user with the same email is also registered.

  // Iniciando a conexão com o BD e a transaction do mysql
  connection.getConnection((err, conn) => {
    conn.beginTransaction(err => {
      // Função para inserir a primeira parte do usuário no banco
      conn.query(
        'INSERT INTO users (name, user_type) VALUES (?, ?)',
        [newUser.name, newUser.user_type],
        (error, results, fields) => {
          if (error) {
            return conn.rollback(() => {
              connection.releaseConnection(conn)
              throw error
            })
          } else {
            // Função para inserir a segunda parte do usuário no banco
            conn.query(
              'INSERT INTO user_login_details (email, password, user_id) VALUES (?, ?, ?)',
              [newUser.email, password, results.insertId],
              (error, result, fields) => {
                if (error) {
                  return conn.rollback(() => {
                    connection.releaseConnection(conn)
                    callback(error, null)
                  })
                }
              }
            )

            // Função para inserir a terceira parte do usuário no banco
            conn.query(
              'INSERT INTO user_giveaway_details (beginning_period, end_period, giveaway_permission, user_id) VALUES (?, ?, ?, ?)',
              [
                newUser.beginning_period,
                newUser.end_period,
                newUser.giveaway_permission,
                results.insertId
              ],
              (error, result, fields) => {
                if (error) {
                  return conn.rollback(() => {
                    connection.releaseConnection(conn)
                    callback(error, null)
                  })
                }
              }
            )

            // Comitando as alterações do usuário no banco de dados
            conn.commit(err => {
              if (err) {
                return conn.rollback(() => {
                  connection.releaseConnection(conn)
                  callback(error, null)
                })
              } else {
                connection.releaseConnection(conn)
                callback(null, { message: 'Usuário cadastrado com sucesso' })
              }
            })
          }
        }
      )
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
    (error, results, fields) => {
      if (error) {
        throw error
      } else {
        callback(null, results)
      }
    }
  )
}

module.exports.editUserPassword = (userData, callback) => {
  connection.query(
    'UPDATE user_login_details SET password = ? WHERE user_id = ?',
    [userData.password, userData.id],
    (error, results, fields) => {
      if (error) {
        throw error
      } else {
        callback(null, results)
      }
    }
  )
}

module.exports.verifyCredentials = (credentialsData, callback) => {
  let password = getHashedPassword(credentialsData.userPassword)

  connection.query(
    'SELECT * FROM `gratidao-sorteador`.user_login_details WHERE email = ? and password = ?',
    [credentialsData.userEmail, password],
    (error, results, fields) => {
      if (error) {
        throw error
      } else {
        callback(null, results)
      }
    }
  )
}
