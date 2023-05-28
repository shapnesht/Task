const CustomAPIError = require('../errors')
const Token = require('../models/Token')
const { isTokenValid, attachCookiesToResponse } = require('../utils')

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies
  // console.log('access:', accessToken, 'refresh:', refreshToken)
  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken)
      // console.log(payload, 'access token')
      if (payload.userId) {
        req.user = payload.userId
        return next()
      }
    }
    const payload = isTokenValid(refreshToken)
    // console.log(payload, 'refresh token')
    const existingToken = await Token.findOne({
      user: payload.userId,
      refreshToken: payload.refreshToken,
    })
    if (!existingToken || !existingToken?.isValid) {
      throw new CustomAPIError.UnauthenticatedError('Authentication Invalid')
    }
    attachCookiesToResponse({
      res,
      refreshToken: existingToken.refreshToken,
      userId: payload.userId,
    })
    req.user = payload.userId
    next()
  } catch (error) {
    throw new CustomAPIError.UnauthenticatedError('Authentication Invalid')
  }
}

module.exports = authenticateUser
