const mongoose = require('mongoose')
const { UserModel } = require('../models/user')
const { registerValidator } = require('../validations/users_validators')
const bcrypt = require('bcrypt')

module.exports = {

    register: async (req, res) => {

        //validation
        const ValidationResult = registerValidator.validate(req.body)
        console.log(ValidationResult)
        if(ValidationResult.error) {
            res.statusCode = 400 //bad request
            return res.json(ValidationResult.error)
        }

        const validatedParams = ValidationResult.value

        //ensure confirm password matched confirm password
        if (validatedParams.password !== validatedParams.confirm_password) {
            res.statusCode = 400 //bad request
            return res.json()
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
            return res.json
        }

        if(user) {
            res.statusCode = 409 //status conflict since user already exists
            return res.json()
        }

        //create new user in database
        try {
            await UserModel.create({
                email: validatedParams.email,
                hashedValue: hash
            }) 

        } catch (err) {
            res.statusCode = 500 //internal server error
            console.log(err)
            return res.json(err)
        }

    }

}