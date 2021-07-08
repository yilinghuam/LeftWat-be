const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        "userID": {type: String, required: true, unique: true},
        "email": {type: String, required: true, unique: true},
        "hashedValue": {type: String, required: true, unique: true},
        "history": {type: [], required: true}
    }, 
    {timestamps: true}
)

const UserModel = mongoose.model('User', schema)

module.exports = {
    UserModel
}