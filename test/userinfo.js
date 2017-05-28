// const test = require('tape')
// const request = require('request')
// const nock = require('nock')

// test('Userinfo Endpoint', (t) => {
//   t.test('GET /userinfo', (assert) => {
//     assert.pass('User make request to the /userinfo endpoint')
//     userinfoEndpoint((error, response, callback) => {
//       assert.equal(response.statusCode, 200, 'returns status 200 OK')
//       assert.equal(response.headers.authorization, 'Bearer SlAV32hkKG', 'valid bearer')
//       assert.skip('check the userinfo object response')
//       assert.skip('error response')
//     })
//   })

//   t.test('Scope values', (assert) => {
//     const scope = 'openid profile email phone'
//     const scopes = ['openid', 'profile', 'email', 'address', 'phone', 'offline_access']
//     assert.pass('scope is enum')
//     assert.pass('scope "openid" is required')
//     assert.pass('multiple scopes are separated by space')
//   })
// })

// function userinfoEndpoint (callback) {
//   nock('https://server.example.com')
//   .get('/userinfo')
//   .matchHeader('Authorization', 'Bearer SlAV32hkKG')
//   .reply(200, 'OK')

//   request({
//     method: 'GET',
//     url: 'https://server.example.com/userinfo',
//     headers: {
//       'Authorization': 'Bearer SlAV32hkKG'
//     }
//   }, callback)
// }

// function userInfoResponse () {
//   return {
//     sub: '',
//     name: '',
//     given_name: '',
//     family_name: '',
//     middle_name: '',
//     nickname: '',
//     preferred_username: '',
//     profile: '',
//     picture: '',
//     website: '',
//     email: '',
//     email_verified: '',
//     gender: '',
//     birthdate: '',
//     zoneinfo: '',
//     locale: '',
//     phone_number: '',
//     phone_number_verified: false,
//     address: {
//       formatted: '',
//       street_address: '',
//       locality: '',
//       region: '',
//       postal_code: '',
//       country: ''
//     },
//     updated_at: 12312312312
//   }
// }