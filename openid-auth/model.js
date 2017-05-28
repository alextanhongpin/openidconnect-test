const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const SALT_WORK_FACTOR = 10

const UserSchema = new mongoose.Schema({
  sub: String,
  name: String,
  given_name: String,
  family_name: String,
  middle_name: String,
  nickname: String,
  preferred_username: String,
  profile: String,
  picture: String,
  website: String,
  email: {
    type: String, 
    required: true, 
    unique: true
  },
  email_verified: Boolean,
  password: {
    type: String, required: true
  },
  gender: String,
  birthdate: {
    type: Date, 
    default: Date.now
  },
  zoneinfo: String,
  locale: String,
  phone_number: String,
  phone_number_verified: Boolean,
  address: {
    formatted: String,
    street_address: String,
    locality: String,
    region: String,
    postal_code: String,
    country: String
  }
}, {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

UserSchema.methods.comparePassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (error, isMatch) => {
      if (error) {
        reject(error)
      } else {
        isMatch ? resolve(true) : reject(new Error('Email or password is invalid'))
      }
    })
  })
}

UserSchema.pre('save', function (next) {
  const user = this
  // only hash password if it is modified, or is new
  if (!user.isModified('password')) return next()

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) return next(err)

        bcrypt.hash(user.password, (err, hash) => {
          if (err) return next(err)
          user.password = hash
          next()
        })
    })
}

module.exports = mongoose.model('User', UserSchema)
