const express = require('express')
const router = express.Router()
const authController = require('./auth.controller')
const authenticate = require('../../middlewares/auth.middleware')

router.post('/login', authController.login)
router.post('/refresh', authController.refresh)
router.get('/me', authenticate, authController.me)
router.post('/logout', authController.logout)

module.exports = router
