const Joi = require('joi')

// The authorization schema when making a request to the openid provider
const authorization = Joi.object().keys({
  response_type: Joi.string().only('code').required(),
  scope: Joi.string().allow('openid', 'profile', 'email').required(),
  client_id: Joi.string().required(),
  redirect_uri: Joi.string().required(),
  state: Joi.string()
})

// The token schema when making a request to the token endpoint
const token = Joi.object().keys({
  code: Joi.string().required(),
  state: Joi.string()
})

// Curry function to compile schema
function compileSchema (schema) {
  return (payload) => {
    return Joi.validate(payload, schema)
  }
}

module.exports = {
  authorization: compileSchema(authorization),
  token: compileSchema(token)
}
