const mongoose = require('mongoose')
const _ = require('lodash')

const schema = new mongoose.Schema(
    {
        "userID": {type: String, required: true},
        "receiptID": {type: String, require: true, unique: true},
        "itemName": {type: String, required: true},
        "itemCategory": {type: String, required: true},
        "itemBrand": {type: String, required: true},
        "priceOfItem": {type: Number, required: true},
        "priceTotal": {type: Number, required: true},
        "countAtPointOfUpload": {type: Number, required: true},
        "countUpdatedByUser": {type: Number, required: true},
        "deleted": false,
        "slug": {
            type: String,
            default: function () {
                return _.kebabCase(this.itemName)
            }
        }
    }
)

const PurchasedItemModel = mongoose.model('ItemPurchased', schema)

module.exports = {
    PurchasedItemModel
}