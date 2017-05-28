// Contains the logic for the server side code (OpenIdProvider)


const openid = new OpenIDProvider('authorization_flow')
const URI = 'https://server.example.com'
const schema = require('../schema/index.js')

function indexEndpoint (callback) {
  nock(URI)
  .get('/')
  .replyWithHtml(200, path.join(__dirname, '..', '.view/index.html'))

  request(URI + '/authorize', callback)
}

router.get('/authorize', (ctx, next) => {
  opendid.authorize(ctx.query)
  .then((client) => {
    res.render('authorize.html', client)
  })
  .then((error) => {
    ctx.redirect(openid.error(error))
  })
})

router.post('/authorize', (req, res) => {
  // Handle Post
  openid.authorize(ctx.body)
  .then((client) => {
    const redirectUriWithCode = openid.authorizationCallback()
    ctx.redirect(redirectUriWithCode)
  }).catch((error) => {
    ctx.redirect(openid.error(error))
  })
})

// Koa js specific openid provider
class OpenIDConnect {
  // Payload can be from get or post
  authorize(props) { // Client
    return new Promise((resolve, reject) => {
      const result = schema.authorization(props)
      if (result.error) {
        return reject(result.error)
      }
      const { client_id } = result.value
      const client = await getclient(client_id)
      client ? reject(new Error('client does not exists')) : resolve(client)
    })
  }
  // Validates the success and redirects back to client
  authorizationCallback() {
    const query = qs.stringify({
      state: '',
      authorizationCode: ''
    })

    return `${this.redirect_uri}?${query}`
  }
  error (message, description) {
    const error = qs.stringify({
      message, description
    })
    return `${this.redirect_uri}?${error}`
  }
}