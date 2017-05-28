const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const url = require('url')

function fullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  })
}
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const PORT = 8000

app.set('view engine', 'ejs')

let isLoggedIn = false

app.get('/', (req, res) => {
  res.render('client-index')
})

app.get('/login', (req, res) => {
  res.locals.referer = req.query.referer
  res.render('server-login')
})

app.get('/logout', (req, res) => {
  isLoggedIn = false
  res.redirect('/')
})

app.post('/login', (req, res) => {
  isLoggedIn = true

  // Check if the url is valid
  if (req.body.referer === 'http://localhost:8000/authorize') {
    // Avoid infinite loop
    res.status(200).json({
      redirect_uri: '/profile'
    })
  } else {
    res.status(200).json({
      redirect_uri: req.body.referer
    })
  }
})

app.get('/register', (req, res) => {
  res.status(200).json({
    msg: 'register'
  })
})

app.get('/authorize', (req, res) => {
  // res.status(200).json({ ok: true })
  console.log(req.url)
  if (isLoggedIn) {
    res.locals.referer = req.query.redirect_uri
    res.locals.redirect_uri = req.query.redirect_uri
    res.locals.payload = req.query

    // Check client
    // Fetch client
    res.render('server-authorize')
  } else {
    res.redirect('/login?referer=' + fullUrl(req))
  }
})

app.post('/authorize', (req, res) => {
  // Check the request type
  // Check the header
  // Check client
  // return code and state
  res.status(200).json({
    redirect_uri: 'http://localhost:4000/authorize/callback?code=123&state=213'
  })
})

app.post('/token', (req, res) => {
  if (req.body.code === '123456') {
    // if (token.expired) > 5 minutes
    // if token used, delete
    res.status(200).json({
      access_token: 'this.is.your.token'
    })
  }
})

app.listen(PORT, () => {
  console.log(`openidprovider: listening to port *:${PORT}. press ctrl + c to cancel`)
})
