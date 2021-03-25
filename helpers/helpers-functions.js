const jwt = require('jsonwebtoken')

function verifyJWT (req, res, next) {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ auth: false, message: 'No token provided.' })
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .json({ auth: false, message: 'Failed to authenticate token.' })
    }

    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.userId
    console.log(req.userId)
    req.userType = decoded.userType
    next()
  })
}

module.exports = verifyJWT
