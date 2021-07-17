const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        "email": { type: String, required: true, unique: true }, // userID
        "hashedValue": { type: String, required: true, unique: true },
        "cloudinaryReceipts": { type: Array },
        "receiptArray": { type: Array },
    }, { timestamps: true }
)

const userModel = mongoose.model('user', userSchema)

module.exports = {
    userModel
} 