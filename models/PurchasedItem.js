const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const lodash = require('lodash')

const itemPurchasedSchema = new Schema(
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
                return lodash.kebabCase(this.itemName)
            }
        }
    }
)

module.exports = mongoose.model('ItemPurchased', itemPurchasedSchema)