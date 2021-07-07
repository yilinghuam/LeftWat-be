const { Router } = require('express')
const router = new Router()
const purchasedItemController = require('../controllers/purchasedItems_controller')

//index route
router.get('/left-wat', purchasedItemController.index)

module.exports = router