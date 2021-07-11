const mongoose = require('mongoose')
const { UserModel } = require('../models/user')
const { registerValidator, loginValidator } = require('../validations/users_validators')
const bcrypt = require('bcrypt')
const moment = require('moment')
const jwt = require('jsonwebtoken')

module.exports = {

    register: async (req, res) => {

        //validation
        const validationResult = registerValidator.validate(req.body)
        if(validationResult.error) {
            res.statusCode = 400 //bad request
            return res.json(validationResult.error)
        }

        const validatedParams = validationResult.value

        //ensure confirm password matched confirm password
        if (validatedParams.password !== validatedParams.confirm_password) {
            res.statusCode = 400 //bad request
            return res.json({
                success: false, 
                message: 'Passwords do not match'
            })
        }

        //hash password using bcrypt

        let hash = ''

        try {
            hash = await bcrypt.hash(validatedParams.password, 10)
        } catch (err) {
            res.statusCode = 500 //internal server error
            console.log(err)
            return res.json()
        }

        if(hash === '') {
            res.statusCode = 500 //internal server error
            return res.json()
        } 

        //check that user does not already exist
        let user = null

        try {
            user = await UserModel.findOne({ email: validatedParams.email })
        } catch (err) {
            res.statusCode = 500 //interal server error
            console.log(err)
            return res.json()
        }

        if(user) {
            res.statusCode = 409 //status conflict since user already exists
            return res.json({
                success: false, 
                message: 'User already exists'
            })
        }

        //create new user in database
        try {
            await UserModel.create({
                email: validatedParams.email,
                hashedValue: hash
            }) 
            return res.json({
                success: true, 
                message: 'User successfully added'
            })
        } catch (err) {
            res.statusCode = 500 //internal server error
            console.log(err)
            return res.json(err)
        }

    },

    login: async (req, res) => {

        //validation
        const validationResult = loginValidator.validate(req.body)
        if(validationResult.error) {
            res.statusCode = 400 //bad request
            return res.json(validationResult.error)
        }

        const validatedParams = validationResult.value

        //verify user email exists
        let user = null

        try {
            user = await UserModel.findOne({ email: validatedParams.email })
        } catch (err) {
            res.statusCode = 500 //interal server error
            return res.json(err)
        }

        if(!user) {
            res.statusCode = 400 //bad request
            return res.json({
                success: false, 
                message: 'Given email or password is incorrect'
            })
        }

        //verify password
        let isPasswordCorrect = false
        try {
            isPasswordCorrect = await bcrypt.compare(validatedParams.password, user.hashedValue)
        } catch (err) {
            res.statusCode = 500 //internal server error
            return res.json(err)
        }

        if(!isPasswordCorrect) {
            res.statusCode = 400 //bad request
            return res.json({
                success:false,
                message: 'Given email or password is incorrect'
            })

        }

        let expiresAt = moment().add(1, 'day').toString()

        //generate JWT and return as response
        let token = jwt.sign(
            {
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1 day'
            }
        )

        res.json({
            token: token,
            expiresAt: expiresAt
        })

    }

}