const mongoose = require('mongoose')
const { userModel } = require('../models/User')
const { changePasswordValidator } = require('../validations/dashboard_validators')
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

    changePassword: async (req, res) => {

        const validationResult = changePasswordValidator.validate(req.body)
        if(validationResult.error) {
            res.status = 400 //bad request
            return res.json(validationResult.error)
        }

        const validatedParams = validationResult.value

        //ensure re-entered new password matches new password
        if(validatedParams.newPassword !== validatedParams.reEnterNewPassword) {
            res.status = 400 //bad request
            return res.json({
                success: false,
                message: 'Passwords do not match'
            })
        }

        //hash new password using bcrypt
        let hash = ''

        try {
            hash = await bcrypt.hash(validatedParams.newPassword, 10)
        } catch (err) {
            res.status = 500 //internal server error
            console.log(err)
            return res.json()
        }

        if(hash === '') {
            res.status = 500 //internal server error
            return res.json({
                success: false,
                message: 'Hash not found'
            })
        }

        //update new password in database
        try {
            userInfo = await userModel.updateOne(
                { email: req.email },
                {
                    $set: {
                        hashedValue: hash
                    }
                }
            )
            return res.json({
                success: true,
                message: 'Password changed successfully',
                hash: hash
            })
        } catch (err) {
            console.log(err)
            status = 500 //internal server error
            res.json(err)
        }
    },

}