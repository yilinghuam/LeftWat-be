const mongoose = require('mongoose')
const { UserModel } = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = {

    register: async (req, res) => {
        try {
            let allUsers = await UserModel.find()
            return res.json(allUsers)
        } catch (err) {
            res.statusCode = 500
            return res.json(err)
        }
    }

}