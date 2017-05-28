const express = require('express')
const app = express()
const PORT = 4000

const OpenID = require('./index.js')
const debug = require('debug')('client')

const openid = OpenID('authorization')({
  response_type: 'code',
  scope: 'openid profile email',
  client_id: 's6BhdRkqt3',
  state: 'af0ifjsldkj',
  redirect_uri: `http://localhost:${PORT}/authorize/callback`
})

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  debug('get:index')
  res.render('client-index')
})

app.get('/authorize', (req, res) => {
  const authUrl = openid.authorize()
  debug('get:authorize:%s', authUrl)
  res.redirect(authUrl)
})

app.get('/authorize/callback', (req, res) => {
  debug('get:authorize/callback:req.query => %s', req.query)
  // Pass all error messages to the locals
  res.locals = req.query
  // Exchange token with access_token
  openid.token({ code: '123456', state: '' }).then(({
    access_token, token_type,
    refresh_token, expires_in, id_token
  }) => {

    debug('get:authorize/callback:access_token => %s', access_token)
    res.locals.access_token = access_token
    res.render('client-authorize')
  }).catch((error) => {
    console.log(error)
  })
})

app.listen(PORT, () => {
  console.log(`relyingparty: listening to port *:${PORT}. press ctrl + c to cancel`)
})