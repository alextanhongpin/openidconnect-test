// const test = require('tape')
// const request = require('request')
// const nock = require('nock')

// test('Implicit Flow', (t) => {

//   t.test('GET /authorize', (assert) => {
//     authorizeEndpoint((error, response, callback) => {
//       assert.test(response.statusCode, 200, 'returns status 200 OK')
//       assert.skip('client is valid')
//       assert.end()
//     })    
//   })

//   t.test('POST /authorize', (assert) => {
//     assert.pass('user accepts the consent')
//     consentEndpoint((error, response, callback) => {
//       assert.test(response.statusCode, 200, 'returns status 200 OK')
//       assert.skip('check the consent parameters')
//       assert.skip('should return access token')
//       assert.skip('should have token type bearer')
//       assert.skip('should have id token')
//       assert.skip('expires in 1 hr')
//       assert.skip('should have state if provided')
//       assert.skip('should construct redirect uri')
//       assert.skip('will perform redirect to redirect_uri of client')
//     })
//   })
// })

// const implicitFlowRequest() {
//   return {
//     response_type: '',
//     client_id: '',
//     scope: 'profile email offline_access',
//     redirect_uri: '',
//     state: '',
//     nonce: '',
//     display: 'page', // popup, touch, wap
//     prompt: 'none login consent select_account',
//     max_age: '',
//     ui_locales: 'fr en',
//     claims_locales: '',
//     id_token_hint: '',
//     login_hint: '',
//     acr_values: '',
//     registration: ''
//   }
// }

// function authorizeEndpoint (callback) {
//   const query = {
//     response_type: 'id_token token',
//     client_id: 's6BhdRkqt3',
//     redirect_uri: 'https://client.example.org/cb',
//     scope: 'openid profile',
//     state: 'af0ifjsldkj',
//     nonce: 'n-0S6_WzA2Mj'
//   }
//   nock('https://server.example.com')
//   .get('authorize')
//   .query(query)
//   .reply(302)

//   request({
//     url: 'https://server.example.com/authorize',
//     method: 'GET',
//     qs: query
//   }, callback)
// }

// function consentEndpoint (callback) {
//   const body = {
//     response_type: 'id_token token',
//     client_id: 's6BhdRkqt3',
//     redirect_uri: 'https://client.example.org/cb',
//     scope: 'openid profile',
//     state: 'af0ifjsldkj',
//     nonce: 'n-0S6_WzA2Mj'
//   }
//   nock('https://server.example.com')
//   .post('/authorize', body)
//   .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
//   .reply(200, {
//     access_token: 'SlAV32hkKG',
//     token_type: 'bearer',
//     id_token: 'the.id.token',
//     state: 'state',
//     expires_in: 3600
//   })

//   request({
//     method: 'POST',
//     form: body,
//     json: true,
//     url: 'https://server.example.com/authorize'
//   }, (callback))
// }