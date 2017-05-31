const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const url = require('url')

const openid = require('./index.js')()

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

const clients = {
  '1': {
    id: 1,
    client_name: 'APP',
    logo_uri: 'src',
    redirect_uris: ['http://localhost:4000/authorize/callback']
  }
}

app.get('/', (req, res) => {  

  res.render('client-index')
})

app.get('/authorize', (req, res) => {
  // res.status(200).json({ ok: true })
  console.log(req.url)
  if (true) {
    openid.authorize(req.query)
    .then((payload) => {
      res.locals.referer = payload.redirect_uri
      res.locals.redirect_uri = payload.redirect_uri
      res.locals.payload = payload
      // Check client
      // Fetch client
      return '1'// payload.client_id
    })
    .then((client_id) => {
      // Fetch client
      const client = clients[client_id]
      if (!client) {
        // error

      }
      return client
    })
    .then((client) => {
      res.locals.client = client
      res.render('server-authorize')
    })
  } else {
    res.redirect('/login?referer=' + fullUrl(req))
  }
})

app.post('/authorize', (req, res) => {
  openid.authorize(req.body)
  .then((payload) => {
    // res.locals.referer = payload.redirect_uri
    // res.locals.redirect_uri = payload.redirect_uri
    // res.locals.payload = payload
    // Check client
    // Fetch client
    return '1'// payload.client_id
  })
  .then((client_id) => {
    // Fetch client
    const client = clients[client_id]
    if (!client) {
      // error

    }
    return client
  })
  .then((client) => {
    // res.locals.client = client
    res.status(200).json({
      redirect_uri: 'http://localhost:4000/authorize/callback?code=123&state=213'
    })
  }).catch((error) => {
    // Handle error
  })
  // Check the request type
  // Check the header
  // Check client
  // return code and state
})


app.listen(PORT, () => {
  console.log(`openidprovider: listening to port *:${PORT}. press ctrl + c to cancel`)
})
