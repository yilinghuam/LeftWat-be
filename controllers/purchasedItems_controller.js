const mongoose = require('mongoose')
const { PurchasedItemModel } = require('../models/PurchasedItem')

module.exports = {

    index: async (req, res) => {
        try {
            let allItems = await PurchasedItemModel.find()
            return res.json(allItems)
        } catch (err) {
            res.statusCode = 500
            return res.json(err)
        }
    }

}