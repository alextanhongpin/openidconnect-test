// Contains the logic for the server side code (OpenIdProvider)

const schema = require('../schema/index.js')
const qs = require('qs')
// Koa js specific openid provider
class OpenID {
  // Payload can be from get or post
  authorize (props) { // Client
    return new Promise((resolve, reject) => {
      const result = schema.authorization(props)
      result.error ? reject(result.error) : resolve(result.value)
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
module.exports = () => {
  return new OpenID
}