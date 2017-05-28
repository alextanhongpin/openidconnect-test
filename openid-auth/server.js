// openid-auth/server.js is a microservice that handles the user registration with jwt tokens

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const User = require('./model.js')
const mongoose = require('mongoose')

// Connect to the database
mongoose.connect('mongodb://localhost/openid')
mongoose.Promise = global.Promise
// Constants
const APP_NAME = 'openid-auth'
const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const PORT = 5000

app.set('view engine', 'ejs')

// Middleware to check if user is already logged in
function checkAuth (req, res, next) {
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

function guardAuth (req, res, next) {
  const authHeader = req.headers.authorization
  if (authHeader === '') {
    return next()
  }
  next(new Error('Check your authorization header.'))
}

// Check if the user is already logged in, redirect if yes


app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to openid-auth microservice'
  })
})

app.get('/logout', (req, res) => {
  isLoggedIn = false
  res.redirect('/')
})

app.get('/login', guardAuth, (req, res) => {
  res.locals.referer = req.query.referer
  res.render('server-login')
})

app.post('/login', guardAuth, (req, res) => {

  const { email, password } = req.body
  User.findOne({ email }).then((user) => {
    if (!user) {
      return next(new Error('no user found'))
    }
    return user.comparePassword(password)
  }).then((isMatchingPassword) => {
    if (!isMatchingPassword) {
      return Promise.reject(new Error('email or password is invalid'))
    }
    // Store user in cookie
    // user._id
    res.status(200).json({
      success: ok,
      data: user
    })
  }).catch((error) => {
    return next(error)
  })
})

app.get('/register', guardAuth, (req, res, next) => {
  const { email, password } = req.body
  User.findOne({ email })
  .then((user) => {
    if (!user) {
      // create a new user
      const newUser = new User({ email, password })
      return newUser
      .save(() => {
        // Generate access and refresh token pair
        req.user = newUser
        return next()
      })
    }
    return user.comparePassword(password)
  }).then((isMatchingPassword) => {
    if (!isMatchingPassword) {
      return Promise.reject(new Error('email or password is invalid'))
    }
    req.user = newUser
    next()
  }).catch((error) => {
    return next(error)
  })
}, (req, res, next) => {
  jwt.sign({
    user_id: req.user._id
  }, JWT_SECRET, {
    expiresIn: '1h'
  }, (err, token) => {
    if (err) return next(err)
    res.status(200).json({
      access_token: token,
      expires_in: 3600
    })
  })
})

app.get('/api/test', checkAuth, (req, res) => {
  res.status(200).json({
    user_id: req.user.id
  })
})

// log errors
app.use((err, req, res, next) => {
  console.error(err.stack)
  next(err)
  // res.status(500).send('Soemthing broke')
})

// client error handler
app.use((err, req, res, next) => {
  if (req.xhr) {
    res.status(500).json({
      error: err.message
    })
  }
  next(err)
})

// errorHandler
app.use((err, req, res, next) => {
  res.status(500)
  res.render('error', { error: err })
})

app.listen(PORT, () => {
  console.log(`listening to port *:${PORT}. press ctrl + c to cancel`)
})
