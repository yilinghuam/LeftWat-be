const express = require('express')
const router = express.Router()
const purchasedItemController = require('../controllers/purchasedItems_controller')

//index route
router.get('/', purchasedItemController.index)

module.exports = router