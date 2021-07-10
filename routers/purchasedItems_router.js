const express = require('express')
const router = express.Router()
const multer = require('multer')
const itemController = require('../controllers/purchasedItems_controller')

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.pdf')
  }
})

let upload = multer({ storage: storage })

//index route
router.get('/', itemController.index)

// upload receipt route
router.post('/upload', upload.single('testReceipt'), itemController.uploadReceipt)

// confirm receipt route
router.post('/upload/confirm', itemController.confirmReceipt)

module.exports = router