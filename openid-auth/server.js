// openid-auth/server.js is a microservice that handles the user registration with jwt tokens

const express = require('express')
const app = express()
const User = require('./model.js')
const mongoose = require('mongoose')
const debug = require('debug')
const jwt = require('./jwt')

// Constants
const APP_NAME = 'openid-auth'
const PORT = 5000
const log = debug(APP_NAME)

// Connect to the database
mongoose.connect('mongodb://localhost/openid')
mongoose.Promise = global.Promise

app.set('view engine', 'ejs')

function guardAuth (req, res, next) {
  if (req.headers.authorization === '') {
    return next()
  }
  next(new Error('Authorization header missing'))
}

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to openid-auth microservice'
  })
})

app.get('/logout', (req, res) => {
  // Clear cookie
  res.redirect('/')
})

app.get('/login', guardAuth, (req, res) => {
  res.locals.referer = req.query.referer
  res.render('auth-login')
})

app.post('/login', guardAuth, (req, res, next) => {
  const { email, password } = req.body

  User.findOne({ email }).then((user) => {
    if (!user) {
      return next(new Error('No user found with the email found'))
    }
    return Promise.all([ user, user.comparePassword(password) ])
  }).then(([ user, ok ]) => {
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
  const { email, password } = req.body

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
    return Promise.all([ user, user.comparePassword(password) ])
  }).then(([ user, ok ]) => {
    req.user = user
    next()
  }).catch((error) => {
    return next(error)
  })
}, jwt.signToken)

app.get('/api/test', jwt.verifyToken, (req, res) => {
  res.status(200).json({
    user_id: req.user.id
  })
})

// log errors
app.use((err, req, res, next) => {
  console.error(err.stack)
  log('error:%s', err.stack)
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
  res.locals.error = err
  res.render('error')
})

app.listen(PORT, () => {
  console.log(`listening to port *:${PORT}. press ctrl + c to cancel`)
})
