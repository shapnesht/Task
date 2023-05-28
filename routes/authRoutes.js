const router = require('express').Router()
const { register, login, logout, getUser } = require('../controller/authController')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').delete(logout)
router.route('/getUser').get(getUser)

module.exports = router
