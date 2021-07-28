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

//forgot password GET route to forgot password form
router.get('/forgot-password', landingController.forgotPasswordForm)

//forgot password POST route to post request from forgot password form
router.post('/forgot-password',landingController.forgotPasswordAction)

//reset password GET route
router.get('/reset-password/:id/:token', landingController.resetPasswordForm)

//reset password POST route to update new password
router.post('/reset-password', landingController.resetPasswordAction)

//logout
router.post('/logout', authenticatedOnlyMiddleware, landingController.logout)

module.exports = router