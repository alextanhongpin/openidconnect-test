const test = require('blue-tape')
const endpoints = require('./endpoints/index.js')

test('Authorization Code Flow', (t) => {
  t.test('end-user is at home page of relying party', (assert) => {
    endpoints.client.home((error, response, body) => {
      assert.error(error, 'shall not have errors')
      assert.equal(response.statusCode, 200, 'shall return status 200 ok')
      assert.equal(body, '<div><a href="/authorize">Continue with server.example.com</a></div>', 'shall render view')
      assert.end()
    })
  })

  t.test('client makes a request to the authorization server', (assert) => {
    endpoints.client.authorize((error, response, body) => {
      assert.error(error, 'shall not have errors')
      assert.equal(response.statusCode, 302, 'shall return status 302')
      assert.equal(body, 'https://server.example.com/authorize?response_type=code&scope=openid%20profile%20email&client_id=s6BhdRkqt3&redirect_uri=https%3A%2F%2Fclient.example.com%2Fauthorization%2Fcallback&state=af0ifjsldkj', 'shall return a link with query to the openid provider')
      assert.end()
    })
  })

  t.test('end-user is at consent screen', (assert) => {
    endpoints.server.authorizeGet((error, response, body) => {
      const client = JSON.parse(body)
      assert.equal(response.statusCode, 200, 'shall return status 200 ok')
      assert.ok(client.client_name.length > 0, 'shall return field "client_name"')
      assert.ok(client.logo_uri.length > 0, 'shall return field "logo_uri"')
      assert.skip('redirect uri matches')
      assert.end()
    })
  })

  t.test('invalid credentials at consent-screen', (assert) => {
    endpoints.server.authorizeGetError((error, response, body) => {
      assert.ok(body.length > 0, 'shall redirect to client with error')
      assert.end()
    })
  })

  t.test('end-user declines authorization at consent-screen', (assert) => {
    endpoints.server.authorizeGetError((error, response, body) => {
      assert.ok(body.length > 0, 'shall redirect to client with error')
      assert.end()
    })
  })

  t.test('end-user accepts authorization at consent-screen', (assert) => {

    endpoints.server.authorizePost((error, response, body) => {
      assert.equal(response.statusCode, 200, 'shall return status 200')
      assert.ok(body.redirect_uri.length > 0, 'shall return redirect_uri with query')
      assert.skip('shall redirect to replying party from client side javascript')
    })

    endpoints.client.authorizeCallback((error, response, body) => {
      const data = JSON.parse(body)
      assert.equal(response.statusCode, 200, 'shall return status 200 ok')
      assert.ok(data.code.length > 0, 'shall have field "code"')
      assert.ok(data.state.length > 0, 'shall have field "state"')
      assert.skip('shall match the state generated')
      assert.skip('shall make request to token endpoint within 5 minutes')
      assert.end()
    })
  })
})
