const express = require('express')
const router = express.Router()
const userController = require('../controllers/user_controller')
const { 
    authenticatedOnly : authenticatedOnlyMiddleware 
} = require('../middlewares/auth_middlewares')

//register
router.post('/register', userController.register)

//login
router.post('/login', userController.login)

//dashboard
router.get('/dashboard', authenticatedOnlyMiddleware, userController.dashboard)

//logout
router.post('/logout', authenticatedOnlyMiddleware, userController.logout)

module.exports = router