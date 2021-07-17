require('dotenv').config()
const express = require('express')
const router = express.Router()
const multer = require('multer')
const inventoryController = require('../controllers/inventory_controller')

// get route to retrieve data
router.get('/',inventoryController.index)

router.patch('/',inventoryController.update)


module.exports = router