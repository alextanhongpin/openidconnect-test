// client.js contains the endpoints from the relying party (RP) that will make the call to the OpenID provider

const request = require('request')
const nock = require('nock')
const fixtures = require('../fixtures/index.js')
const qs = require('qs')
const path = require('path')

const OpenIDSDK = require('../../openid-client/index.js')
const oid = OpenIDSDK('authorization')(fixtures.authorizationRequest)

const CLIENT_URI = 'https://client.example.com'

nock.disableNetConnect()

// GET client.example.com
function home (callback) {
  nock(CLIENT_URI)
  .get('/')
  .replyWithFile(200, path.join(__dirname, '..', '..', '/views/index.html'))

  request(CLIENT_URI, callback)
}

// GET client.example.com/authorize
function authorize (callback) {
  nock(CLIENT_URI)
  .get('/authorize')
  .reply(302, oid.authorize())

  request(`${CLIENT_URI}/authorize`, callback)
}

// GET client.example.com/authorize/callback
function authorizeCallback (callback) {
  const query = fixtures.authorizationResponse
  nock(CLIENT_URI)
  .get('/authorize/callback')
  .query(query)
  .reply(200, query)

  request(`${CLIENT_URI}/authorize/callback?${qs.stringify(query)}`, callback)
}

function token (callback) {}


module.exports = {
  home,
  authorize,
  authorizeCallback,
  token
}
