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

// delete receipt from history page
router.delete('/delete-receipt', authenticatedOnlyMiddleware, dashboardController.deleteReceipt)

router.get('/',authenticatedOnlyMiddleware,dashboardContorller.retrievePieData)
module.exports = router