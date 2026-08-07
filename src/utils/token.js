const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt')

const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn,
  })
}

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  })
}

const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtConfig.accessSecret)
}

const verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtConfig.refreshSecret)
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
}
