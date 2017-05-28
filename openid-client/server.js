const express = require('express')
const app = express()
const PORT = 4000

const OpenID = require('./index.js')

const openid = OpenID('authorization')({
  response_type: 'code',
  scope: 'openid profile email',
  client_id: 's6BhdRkqt3',
  state: 'af0ifjsldkj',
  redirect_uri: `http://localhost:${PORT}/authorize/callback`
})

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('client-index')
})

app.get('/authorize', (req, res) => {
  res.redirect(openid.authorize())
})

app.get('/authorize/callback', (req, res) => {
  res.locals = req.query

  // Exchange token with access_token
  openid.token({ code: '123456' }).then(({
    access_token, token_type,
    refresh_token, expires_in, id_token
  }) => {
    console.log('obtained token', access_token)
    res.locals.access_token = access_token
    res.render('client-authorize')
  }).catch((error) => {
    console.log(error)
  })
})

app.listen(PORT, () => {
  console.log(`relyingparty: listening to port *:${PORT}. press ctrl + c to cancel`)
})