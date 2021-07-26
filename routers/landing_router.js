const express = require('express')
const router = express.Router()
const landingController = require('../controllers/landing_controller')
const { 
    authenticatedOnly : authenticatedOnlyMiddleware 
} = require('../middlewares/auth_middlewares')

//register
router.post('/register', landingController.register)

//login
router.post('/login', landingController.login)

//logout
router.post('/logout', authenticatedOnlyMiddleware, landingController.logout)

module.exports = router