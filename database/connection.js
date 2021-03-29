const mysql = require('mysql2')

//Definindo o banco de dados
const dataBase = mysql.createPool({
  host: 'localhost',
  user: 'lucasvscs',
  database: 'gratidao-sorteador',
  password: process.env.DB_PASSWORD,
  timezone: '-03:00',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: ['DATE', 'DATETIME']
})

module.exports = dataBase
