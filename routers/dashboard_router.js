const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboard_controller')
const { 
    authenticatedOnly : authenticatedOnlyMiddleware 
} = require('../middlewares/auth_middlewares')

// retrieve dashboard user data
router.get('/', authenticatedOnlyMiddleware, dashboardController.userData)

// change password
router.patch('/changepassword', authenticatedOnlyMiddleware, dashboardController.changePassword)

module.exports = router