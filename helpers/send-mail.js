const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gratidaosorteador@gmail.com',
    pass: 'gratidaosorteadorpaula'
  }
})

const mailController = {
  sendEmail (userEmail, userPassword) {
    transporter.sendMail(
      {
        from: 'gratidaosorteador@gmail.com',
        to: userEmail,
        subject: 'Senha de acesso - Gratidão Sorteador',
        html:
          '<h1>Sua senha de acesso para o sistema Gratidão Sorteador é: <b>' +
          userPassword +
          '</b><h1>'
      },
      (error, info) => {
        if (error) {
          console.log(error)
        } else {
          console.log('Email sent: ' + info.response)
        }
      }
    )
  }
}

module.exports = mailController

/*
const mailOptions = {
  from: 'gratidaosorteador@gmail.com',
  to: 'lucasvscs@outlook.com',
  subject: 'Senha de acesso - Gratidão Sorteador',
  html:
    '<h1>Sua senha de acesso para o sistema Gratidão Sorteador é: <b>' +
    userPassword +
    '</b><h1>'
}

module.exports.emailSend = transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error)
  } else {
    console.log('Email sent: ' + info.response)
  }
})
*/
