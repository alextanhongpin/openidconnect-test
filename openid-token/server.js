app.post('/token', (req, res) => {
  if (req.body.code === '123456') {
    // if (token.expired) > 5 minutes
    // if token used, delete
    res.status(200).json({
      access_token: 'this.is.your.token'
    })
  }
})
