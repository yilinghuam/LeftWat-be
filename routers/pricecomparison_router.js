const express = require('express')
const router = express.Router()
const pricecomparisonController = require('../controllers/pricecomparison_controller')
const { 
    authenticatedOnly : authenticatedOnlyMiddleware, authenticatedOnly 
} = require('../middlewares/auth_middlewares')

//retrieve listdata
router.get('/', pricecomparisonController.index)

router.get('/search',authenticatedOnly,pricecomparisonController.show)

module.exports = router