const router = require('express').Router()
const {
  register,
  login,
  logout,
  getUser,
} = require('../controller/authController')
const authenticateUser = require('../middlewares/authenticateUser')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').delete([authenticateUser, logout])
router.route('/getUser').get([authenticateUser, getUser])

module.exports = router
