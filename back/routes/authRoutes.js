const express = require('express')
const router = express.Router()
const { register, login, loginVulnerable } = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.post('/loginVulnerable', loginVulnerable)

module.exports = router