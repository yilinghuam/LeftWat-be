const mongoose = require('mongoose')
const { userModel } = require('../models/User')
const { registerValidator, loginValidator } = require('../validations/users_validators')
const bcrypt = require('bcrypt')
const moment = require('moment')
const jwt = require('jsonwebtoken')

module.exports = {
    dashboard: async (req, res) => {
        //get user info     
        try {
            userInfo = await userModel.findOne({ email: req.email })

            return res.json({ 
                success: true,
                message: 'User found',
                userInfo,
            })
        } catch (err) {
            res.status(500) //internal server error
            return res.json(err)
        }
    },

}