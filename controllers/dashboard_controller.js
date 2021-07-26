const mongoose = require('mongoose')
const { userModel } = require('../models/User')
const { itemModel } = require('../models/Item')
const { changePasswordValidator } = require('../validations/dashboard_validators')
const bcrypt = require('bcrypt')
const moment = require('moment')
const jwt = require('jsonwebtoken')


module.exports = {
    userData: async (req, res) => {
          
        try {
            //get user info
            userInfo = await userModel.findOne({ 'email': req.email })

            //get user's receipts and cloudinary links
            userReceiptIDs = userInfo.receiptArray
            userCloudinaryLinks = userInfo.cloudinaryReceipts

            //array of objects to store info of last 5 receipts
            let displayLastFiveReceipts = [ 
                { receiptID: '', cloudinaryURL: '' },
                { receiptID: '', cloudinaryURL: '' },
                { receiptID: '', cloudinaryURL: '' },
                { receiptID: '', cloudinaryURL: '' },
                { receiptID: '', cloudinaryURL: '' },
            ]
            
            //only show last 5 receipts, starting from last one
            let displayPosition = 0

            for (let receiptPosition = userReceiptIDs.length - 1; receiptPosition > userReceiptIDs.length - 6; receiptPosition--) {

                displayLastFiveReceipts[displayPosition].receiptID = userReceiptIDs[receiptPosition]
                displayLastFiveReceipts[displayPosition].cloudinaryURL = userCloudinaryLinks[receiptPosition]

                displayPosition++
            }

            return res.json({ 
                success: true,
                message: 'User found',
                userInfo,
                displayLastFiveReceipts,
            })
        } catch (err) {
            res.status(500) //internal server error
            res.json(err)
        }
    },

    changePassword: async (req, res) => {

        const validationResult = changePasswordValidator.validate(req.body)
        if(validationResult.error) {
            res.status(400) //bad request
            return res.json(validationResult.error)
        }

        const validatedParams = validationResult.value

        //ensure re-entered new password matches new password
        if(validatedParams.newPassword !== validatedParams.reEnterNewPassword) {
            res.status(400) //bad request
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
            res.status(500) //internal server error
            console.log(err)
            return res.json()
        }

        if(hash === '') {
            res.status(500) //internal server error
            return res.json({
                success: false,
                message: 'Hash not found'
            })
        }

        //update new password in database
        try {
            await userModel.updateOne(
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
            res.status(500) //internal server error
            res.json(err)
        }
    },

    deleteReceipt: async (req, res) => {

        //delete all items of receipt
        try {
            await itemModel.deleteMany({ receiptID: req.body.receiptID })

        } catch (err) {
            res.status(500) //internal server error
            res.json(err)
        }

        //delete from user's receiptArray
        try {
            user = await userModel.findOne({ email: req.email })

            userReceipts = user.receiptArray

            //delete receiptID from receiptArray
            for (let receiptIndex = 0; receiptIndex < userReceipts.length; receiptIndex++) {
                if(userReceipts[receiptIndex] === req.body.receiptID ) {
                    userReceipts.splice(receiptIndex, 1)
                }   
            }

            await userModel.updateOne(
                { email: req.email },
                {
                    $set: {
                        receiptArray: userReceipts
                    }
                }
            )

            res.json({
                message: 'receipt deleted from user\'s receiptArray',
                userReceipts
            })
        } catch (err) {
            res.status(500) //internal server error
        }
    },
    retrievePieData: async(req,res) => {
        let user = jwt.verify(req.headers.user,process.env.JWT_SECRET)
        console.log(req.email)

        try {
            const productData = await itemModel.find(
                {
                    'userID.email':user.email, 
                    deletedByUser:false, 
                })
            const meatData = productData.filter(elem => elem.itemCategory === 'Meat').length
            const vegetableData = productData.filter(elem => elem.itemCategory === 'Vegetable').length
            const otherData = productData.filter(elem => elem.itemCategory === 'Others').length
            return res.json(
                {   meat:meatData,
                    vegetable:vegetableData,
                    others:otherData
                })
        } catch (error) {
            res.statusCode = 400
            console.log(error)
            return res.json(error)
        }
    }
}