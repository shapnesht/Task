const createTokenUser = require('./createTokenUser')
const {
  attachCookiesToResponse,
  createJWT,
  isTokenValid,
  removeCookies,
} = require('./jwt')

module.exports = {
  createTokenUser,
  attachCookiesToResponse,
  createJWT,
  isTokenValid,
  removeCookies,
}
