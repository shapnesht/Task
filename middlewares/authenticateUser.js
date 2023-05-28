const CustomAPIError = require('../errors')
const Token = require('../models/Token')
const { isTokenValid, attachCookiesToResponse } = require('../utils')

const authenticateUser = async (req, res, next) => {
  console.log(req)
  const { accessToken, refreshToken } = req.signedCookies

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken)
      req.user = payload.user
      next()
    }

    const payload = isTokenValid(refreshToken)
    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    })

    if (!existingToken || !existingToken?.isValid) {
      throw new CustomAPIError.UnauthenticatedError('Authentication Invalid')
    }

    attachCookiesToResponse({ res, refreshToken, user: payload.user })
    req.user = payload.user
    next()
  } catch (error) {
    throw new CustomAPIError.UnauthenticatedError('Authentication Invalid')
  }
}

module.exports = authenticateUser
