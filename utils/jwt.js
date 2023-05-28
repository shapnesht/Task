const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  return token
}

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({ res, refreshToken, userId }) => {
  const accessTokenJWT = createJWT({ payload: { userId } })
  const refreshTokenJWT = createJWT({
    payload: { userId, refreshToken },
  })

  const fifteenMins = 1000 * 60 * 15
  const oneDay = 1000 * 60 * 60 * 24

  res.cookie('accessToken', accessTokenJWT, {
    signed: true,
    expires: new Date(Date.now() + fifteenMins),
    httpOnly: true,
  })

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + oneDay),
  })
}
const removeCookies = (res) => {
  res.cookie('accessToken', 'logout', {
    signed: true,
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.cookie('refreshToken', 'logout', {
    signed: true,
    expires: new Date(Date.now()),
    httpOnly: true,
  })
}

module.exports = {
  attachCookiesToResponse,
  createJWT,
  isTokenValid,
  removeCookies,
}
