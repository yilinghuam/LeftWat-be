const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        "email": {type: String, required: true, unique: true},
        "hashedValue": {type: String, required: true, unique: true},
    }, 
    {timestamps: true}
)

const UserModel = mongoose.model('User', schema)

module.exports = {
    UserModel
}