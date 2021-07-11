const mongoose = require('mongoose')
const _ = require('lodash')

const testUploadSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    itemQuantity: { type: Number, required: true },
    itemPrice: { type: Number, required: true },
    slug: {
        type: String,
        default: function() {
            return _.kebabCase(this.itemName)
            }
        },
    }, { timestamps: { createdAt: true, updatedAt: false } })

const testUploadModel = mongoose.model('testUpload', testUploadSchema)

module.exports = {
    testUploadModel
}