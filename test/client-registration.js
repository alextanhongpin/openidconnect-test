const test = require('blue-tape')
const request = require('request')
const fixtures = require('./fixtures/index.js')

const nock = require('nock')
nock.disableNetConnect()


test('Dynamic Client Registration', (t) => {
  // POST /connect/register
  t.test('register new client success', (assert) => {
    connectRegisterEndpoint((error, response, body) => {
      assert.error(error, 'shall not return error')
      assert.equal(response.statusCode, 201, 'shall returns status 201 Created')
      assert.equal(response.headers['content-type'], 'application/json', 'shall return json object')
      assert.equal(response.headers['cache-control'], 'no-store', 'shall set cache-control to no-store')
      assert.equal(response.headers['pragma'], 'no-cache', 'shall set pragma to no-cache')
      assert.skip('check fields to return')
      assert.end()
    })
  })

  // POST /connect/register Fail
  t.test('register new client fail', (assert) => {
    connectRegisterClientErrorEndpoint((error, response, body) => {
      // assert.equal(response.statusCode, 400, 'returns status 400 Bad Request')
      assert.ok(error.error.length > 0, 'field "error" is present')
      assert.ok(error.error_description.length > 0, 'field "error_description" is present')
      assert.end()
    })
  })
  // GET /connect/register?client_id=CLIENT_ID
  t.skip('read a client by client_id', (assert) => {
    clientReadRequestEndpoint((error, response, body) => {
      // assert.equal(response.statusCode, 200, 'returns status 200 OK')
      assert.skip('check if fields are present')
      assert.skip('check if the bearer is valid')
      // assert.end()
    })
  })

  t.test('GET /connect/register?client_id=12 Fail', (assert) => {
    clientReadRequestErrorEndpoint((error, response, body) => {
      const json = JSON.parse(body)
      assert.equal(response.statusCode, 400, 'shall return bad request')
      assert.equal(response.headers['content-type'], 'application/json', 'shall return json object')
      assert.equal(response.headers['cache-control'], 'no-store', 'shall set cache-control to no-store')
      assert.equal(response.headers['pragma'], 'no-cache', 'shall set pragma to no-cache')
      assert.ok(json.error.length > 0, 'shall return "error" field')
      assert.ok(json.error_description.length > 0, 'shall return "error_description" field')
      assert.end()
    })
  })
})

// Registers a new client and returns the response
function connectRegisterEndpoint (callback) {
  const payload = fixtures.clientCreateRequest
  const response = fixtures.clientCreateResponse

  nock('https://server.example.com')
  .post('/connect/register', payload)
  .matchHeader('Content-Type', 'application/json')
  .matchHeader('Authorization', 'Bearer 123456')
  .reply(201, response, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache'
  })

  request({
    url: 'https://server.example.com/connect/register',
    method: 'POST',
    json: true,
    body: payload,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 123456'
    }
  }, callback)
}

function connectRegisterClientErrorEndpoint(callback) {
  // Mock the endpoint that returns an error
  const reply = {
    error: 'invalid_redirect_uri',
    error_description: 'One or more redirect_uri values are invalid'
  }
  const replyHeader = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache'
  }
  nock('https://server.example.com')
  .post('/connect/register')
  .replyWithError(reply, replyHeader)

  // Make a request to the mock endpoint
  request({
    method: 'POST',
    url: 'https://server.example.com/connect/register'
  }, callback)
}

function clientReadRequestEndpoint (callback) {
  const reply = fixtures.clientRequest
  const replyHeader = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache'
  }
  nock('https://server.example.com')
  .get('/connect/register')
  .query({
    client_id: 's6BhdRkqt3'
  })
  .matchHeader({
    'Authorization': 'Bearer THIS_IS_AN_ACCESS_TOKEN_VALUE'
  })
  .reply(200, reply, replyHeader)

  request({
    method: 'GET',
    url: 'https://server.example.com/connect/register?client_id=s6BhdRkqt3',
    headers: {
      'Authorization': 'Bearer THIS_IS_AN_ACCESS_TOKEN_VALUE'
    }
  }, callback)
}

function clientReadRequestErrorEndpoint (callback) {
  const reply = fixtures.errors
  const replyHeader = fixtures.headerResponse

  nock('https://server.example.com')
  .get('/connect/register')
  .reply(400, reply, replyHeader)
  request('https://server.example.com/connect/register', callback)
}