const express = require('express')
const router = express.Router()
const pricecomparisonController = require('../controllers/pricecomparison_controller')
const { 
    authenticatedOnly : authenticatedOnlyMiddleware 
} = require('../middlewares/auth_middlewares')

//retrieve listdata
router.get('/', pricecomparisonController.index)

module.exports = router