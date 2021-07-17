const mongoose = require('mongoose')
const _ = require('lodash')
const moment = require('moment')

// const timestampNow = moment().utc()

const itemSchema = new mongoose.Schema({
    userID: { type: Array, required: true },
    receiptID: { type: String, require: true, unique: true },
    itemName: { type: String, required: true },
    itemCategory: { type: String, default: "Others", required: true },
    // itemBrand: { type: String, required: true },
    itemPrice: { type: Number, required: true },
    itemPriceTotal: { type: Number, required: true },
    itemQuantityAtUpload: { type: Number, required: true },
    itemQuantityUpdatedByUser: { type: Number, required: true },
    deletedByUser: { type: Boolean, default: false },
    slug: { type: String },
    }, { timestamps: { createdAt: true, updatedAt: true } })

const itemModel = mongoose.model('item', itemSchema)

module.exports = {
    itemModel
}