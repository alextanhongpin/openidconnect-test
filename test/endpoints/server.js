// server.js contains the openid endpoints

const request = require('request')
const nock = require('nock')
const fixtures = require('../fixtures/index.js')
const qs = require('qs')
const path = require('path')

const SERVER_URI = 'https://server.example.com'

nock.disableNetConnect()
// Mocks the authorization endpoint
function authorizeGet (callback) {
  const query = fixtures.authorizationRequest
  const reply = fixtures.clientResponse

  nock(SERVER_URI)
  .get('/authorize')
  .query(query)
  .reply(200, reply)

  request(`${SERVER_URI}/authorize?${qs.stringify(query)}`, callback)
}

function authorizeGetError(callback) {
  const redirectUri = fixtures.authorizationRequest.redirect_uri
  const errors = fixtures.errors

  nock(SERVER_URI)
  .get('/authorize')
  .reply(302, `${redirectUri}?${qs.stringify(errors)}`)

  request(`${SERVER_URI}/authorize`, callback)
}

function authorizePost (callback) {
  const form = fixtures.authorizationRequest
  const reply = fixtures.authorizationResponse

  const redirect_uri = `${form.redirect_uri}?${qs.stringify(reply)}`

  // Ajax POST method cannot have redirect
  nock(SERVER_URI)
  .post('/authorize', form)
  .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
  .reply(200, { redirect_uri })

  request({
    method: 'POST',
    url: `${SERVER_URI}/authorize`,
    form: form,
    json: true
  }, callback)
}

function authorizePostError () {

}

module.exports = {
  authorizeGet,
  authorizeGetError,
  authorizePost,
  authorizePostError
}