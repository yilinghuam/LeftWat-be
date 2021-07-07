const { Router } = require('express')
const router = new Router()
const purchasedItemsRouter = require('./purchasedItems')

router.use('/left-wat', purchasedItemsRouter)

module.exports = router