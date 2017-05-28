const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

// Middleware to check if user is already logged in
function verifyToken (req, res, next) {
  const authHeader = req.headers.authorization
  const [ tokenType, token ] = authHeader.split(' ')
  if (tokenType.toLowerCase() !== 'bearer') {
    return next(new Error('Token type not recognized'))
  }
  if (token === '') {
    return next(new Error('Authorization token not present'))
  }
  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
      return next(error)
    }
    req.id = decoded.user_id
    // Compare with redis or db that the id is valid
    return next()
  })
}

// Middleware to create a token
function signToken (req, res, next) {
  const hasUserId = req.user && req.user._id
  if (!hasUserId) {
    return next(new Error('Unable to create token. User ID is not present.'))
  }
  const payload = {
    user_id: req.user._id
  }
  const options = {
    expires_in: '1h'
  }
  jwt.sign(payload, JWT_SECRET, options, (error, token) => {
    if (error) {
      return next(error)
    }
    res.status(200).json({
      access_token: token,
      expires_in: 3600
    })
  })
}

module.exports = {
  verifyToken,
  signToken
}
