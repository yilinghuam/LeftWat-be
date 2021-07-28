const mongoose = require('mongoose')
const { userModel } = require('../models/User')
const { registerValidator, loginValidator, resetPasswordValidator } = require('../validations/landing_validators')
const bcrypt = require('bcrypt')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const sendgrid = require('@sendgrid/mail')

module.exports = {

    register: async (req, res) => {

        //validation
        const validationResult = registerValidator.validate(req.body)
        if(validationResult.error) {
            res.statusCode = 400 //bad request
            return res.json(validationResult.error)
        }

        const validatedParams = validationResult.value

        //ensure confirm password matches password
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
            return res.json(err)
        }

        if(hash === '') {
            res.statusCode = 500 //internal server error
            return res.json()
        } 

        //check that user does not already exist
        let user = null

        try {
            user = await userModel.findOne({ email: validatedParams.email })
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
            await userModel.create({
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
            user = await userModel.findOne({ email: validatedParams.email })
        } catch (err) {
            res.statusCode = 500 //interal server error
            return res.json({
                err, 
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
        const token = jwt.sign(
            {
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1 day'
            }
        )

        //store jwt in cookie called "access_token"
        return res
            .cookie('access_token', token, {
                httpOnly: true,
                secure: false,
            })
            .status(200) //success
            .json({
                message: 'Logged in succesfully!', 
                token, 
                expiresAt
            })

    },

    forgotPasswordForm: (req, res) => {

        //temporary reset password form template
        //to add page in frontend
        res.send(
            '<form action="/api/v1/landing/forgot-password" method="POST">' +
            '<input type="email" name="email" value="" placeholder="Enter your email address..." />' +
            '<input type="submit" value="Reset Password" />' +
            '</form>'
        )
        
        
    },

    forgotPasswordAction: async (req, res) => {

        //if email is not filled in, redirect to reset password form
        if (req.body.email === '') {
            res.redirect('/api/v1/landing/forgot-password')
            return
        }

        //setting up SendGrid email service
        const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
        sendgrid.setApiKey(SENDGRID_API_KEY)

        try {
            //find user that matches the email address 
            let user = await userModel.findOne({ email: req.body.email })

            //if user does not exist, redirect back to reset password form
            if(!user) {
                console.log('user does not exist')
                res.redirect('/api/v1/landing/forgot-password')
                return
            }

            //create one-time token using hashedValue and created date
            let createdTime = user.createdAt

            let secretKey = user.hashedValue + '-' + createdTime

            const oneTimeToken = jwt.sign(
                {
                    email: user.email
                },
                    secretKey,
                {
                    expiresIn: '1 day'
                }
            )

            const msg = {
                to: req.body.email,
                from: 'p.yingxin@gmail.com',
                subject: 'Reset your LeftWat password',
                html: `<a href="http://localhost:7000/api/v1/landing/reset-password/${user.email}/${oneTimeToken}">Reset password</a>`,
            }

            sendgrid
                .send(msg)
                .then((resp) => {
                    console.log('Email sent\n', resp)
                })
                .catch((error) => {
                    console.error(error)
                })

            res.json({
                message: 'reset password working',
                oneTimeToken
            })
        } catch (err) {
            res.status(400) //bad request
            res.json(err)
        }
    },

    resetPasswordForm: async (req, res) => {
        
        //find user in db
        try {
            let user = await userModel.findOne({ email: req.params.id })

            //if user does not exist in db, redirect to login page
            if(!user) {
                console.log('user does not exist')
                res.redirect('/api/v1/landing/login')
                return
            }

            //decode one-time token using hashedValue and created date
            let createdTime = user.createdAt

            let secretKey = user.hashedValue + '-' + createdTime

            let payload = jwt.decode(req.params.token, secretKey)

            //temporary reset password form that hides email and token
            //to add page in frontend
            res.send(
                '<form action="/api/v1/landing/reset-password" method="POST">' +
                '<input type="hidden" name="email" value="' + payload.email + '" />' +
                '<input type="hidden" name="token" value="' + req.params.token + '" />' +
                '<input type="password" name="new_password" value="" placeholder="Enter your new password..." />' +
                '<input type="submit" value="Reset Password" />' +
                '</form>'
            )
        } catch (err) {
            res.status(500) //internal server error
            res.json (err)
        }
    },

    resetPasswordAction: async (req, res) => {

        let payload = ''
        
        //decode payload 
        try {
            let user = await userModel.findOne({ email: req.body.email })
            
            let secretKey = user.hashedValue + '-' + user.createdTime
            payload = jwt.decode(req.body.token, secretKey)
        } catch (err) {
            res.status(400) //bad request
            res.json(err)
        }

        //validation
        const validationResult = resetPasswordValidator.validate(req.body)
        if(validationResult.error) {
            res.statusCode = 400 //bad request
            return res.json(validationResult.error)
        }

        const validatedParams = validationResult.value

        //hash password using bcrypt
        let hash = ''

        try {
            hash = await bcrypt.hash(validatedParams.new_password, 10)
        } catch (err) {
            res.statusCode = 500 //internal server error
            console.log(err)
            return res.json(err)
        }

        if(hash === '') {
            res.statusCode = 500 //internal server error
            return res.json()
        } 

        //update user's password in database
        try {
            await userModel.findOneAndUpdate(
                { email: payload.email },
                {
                    $set: {
                        hashedValue: hash
                    }
                }
            ) 
            return res.json({
                success: true, 
                message: 'Password reset successfully'
            })
        } catch (err) {
            res.statusCode = 500 //internal server error
            console.log(err)
            return res.json(err)
        }
    },

    logout: (req, res) => {
        return res
            .clearCookie('access_token')
            .status(200) //success
            .json({ message: 'Logged out successfully!' })
    }

}