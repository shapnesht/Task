const User = require('../models/User')
const Token = require('../models/Token')
const crypto = require('crypto')
const CustomApiError = require('../errors')
const { StatusCodes } = require('http-status-codes')

const {
  createTokenUser,
  attachCookiesToResponse,
  removeCookies,
} = require('../utils')

const register = async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    throw new CustomApiError.BadRequestError(
      'Please provide name, email and password.'
    )
  }
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new CustomApiError.BadRequestError(
      'User with given email already exists.'
    )
  }
  const user = await User.create({ name, email, password })

  const tokenUser = createTokenUser(user)
  let refreshToken = crypto.randomBytes(60).toString('hex')

  await Token.create({ refreshToken, user: user._id })
  attachCookiesToResponse({ res, refreshToken, tokenUser })

  res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new CustomApiError.BadRequestError(
      'Please provide email and password.'
    )
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new CustomApiError.UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePasswords(password)

  if (!isPasswordCorrect) {
    throw new CustomApiError.UnauthenticatedError('Invalid Credentials')
  }

  const tokenUser = createTokenUser(user)

  let refreshToken = ''

  const existingToken = await Token.findOne({ user: user._id })

  if (existingToken) {
    const { isValid } = existingToken
    if (!isValid) {
      throw new CustomApiError.UnauthenticatedError('Invalid Credentials')
    }
    refreshToken = existingToken.refreshToken
    attachCookiesToResponse({ res, user: tokenUser, refreshToken })
    res.status(StatusCodes.OK).json({ user: tokenUser })
    return
  }

  refreshToken = await crypto.randomBytes(10).toString('hex')

  await Token.create({ refreshToken, user: user._id })
  attachCookiesToResponse({ res, refreshToken, tokenUser })

  res.status(200).json({ user: tokenUser })
}

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId })

  removeCookies(res)

  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}
const getUser = async (req, res) => {
  const user = await User.findOne({ user: req.user }).select('name email')

  res.status(StatusCodes.OK).json(user)
}

module.exports = {
  register,
  login,
  logout,
  getUser,
}
