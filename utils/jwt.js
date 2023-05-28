const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  return token
}

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({ res, refreshToken, user }) => {
  const accessTokenJWT = createJWT({ payload: { user } })
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } })

  const fifteenMins = 1000 * 60 * 15
  const oneDay = 1000 * 60 * 60 * 24

  res.cookie('accessToken', accessTokenJWT, {
    signed: true,
    expies: new Date(Date.now() + fifteenMins),
    httpOnly: true,
  })

  res.cookie('refreshToken', refreshTokenJWT, {
    signed: true,
    expies: new Date(Date.now() + oneDay),
    httpOnly: true,
  })
}
const removeCookies = (res) => {
  res.cookie('accessToken', 'logout', {
    signed: true,
    expies: new Date(Date.now()),
    httpOnly: true,
  })

  res.cookie('refreshToken', 'logout', {
    signed: true,
    expies: new Date(Date.now()),
    httpOnly: true,
  })
}

module.exports = {
  attachCookiesToResponse,
  createJWT,
  isTokenValid,
  removeCookies,
}
