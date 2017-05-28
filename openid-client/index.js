const qs = require('querystring')
const request = require('request')
const schema = require('../schema/index.js')


// TODO: Complete the remaining flows
class ImplicitFlow {}
class HybridFlow {}

const OpenIDProvider = (provider) => {
  switch (provider) {
    case 'authorization':
      return props => new AuthorizationFlow(props)
    case 'implicit':
      return props => new ImplicitFlow(props)
    case 'hybrid':
      return props => new HybridFlow(props)
    default:
      return props => new AuthorizationFlow(props)
  }
}
module.exports = OpenIDProvider

// const openid = new OpenIDProvider('authorization')({
//   response_type: 'code',
//   scope: 'openid profile email',
//   client_id: 's6BhdRkqt3',
//   state: 'af0ifjsldkj',
//   redirect_uri: 'https://client.example.com/authorization/callback'
// })


// router.get('/authorize', openid.authorize)
// // OR
// router.get('/authorize', (ctx, next) => {
//   const uri = openid.makeAuthEndpoint()
//   ctx.redirect(uri)
// })

// router.get('/authorize/callback', (ctx, next) => {
//   openid.exchangeToken(ctx.query)
//   .then({ access_token, refresh_token, expires_in} => {
//     // do something
//     // store in cookie or localstorage
//   })
//   .catch((error) => {

//   })
// })


class AuthorizationFlow {
  constructor (props) {
    const result = schema.authorization(props)
    if (result.error) {
      console.log(result.error.name, result.error.details)
    }
    Object.assign(this, result.value)
    this.openid_auth_uri = 'http://localhost:8000/authorize'
    this.openid_token_uri = 'http://localhost:8000/token'
  }

  authorize () {
    // This will the parametes and costruct a url to go the page
    const query = qs.stringify({
      response_type: this.response_type,
      scope: this.scope,
      client_id: this.client_id,
      redirect_uri: this.redirect_uri,
      state: this.state
    })

    return `${this.openid_auth_uri}?${query}`
  }
  token (params) {
    console.log('sending token parameters')
    return new Promise((resolve, reject) => {
      const result = schema.token(params)
      if (result.error) {
        return reject(result.error)
      }
      console.log('sending token parameters', result)
      request({
        method: 'POST',
        url: this.openid_token_uri,
        json: true,
        form: result.value
      }, (error, response, body) => {
        error ? reject(error) : resolve({
          access_token: body.access_token,
          token_type: body.token_type,
          refresh_token: body.refresh_token,
          expires_in: body.expires_in,
          id_token: body.id_token
        })
      })
    })
  }
}
