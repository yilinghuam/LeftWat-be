require('dotenv').config()
const _ = require('lodash')
const moment = require('moment')
const mongoose = require('mongoose')
const { itemModel } = require('../models/Item')
const jwt = require('jsonwebtoken')

module.exports = {
    index: async(req,res) => {

        // retrieve emailidentification from jwt token first
        let user = jwt.verify(req.headers.user,process.env.JWT_SECRET)

        try {
            const productData = await itemModel.find(
                {
                    'userID.email':user.email, 
                    deletedByUser:false, 
                })
            // need to include 5 most recent receipt data  that 
            return res.json(productData)
        } catch (error) {
            res.statusCode = 400
            console.log(error)
            return res.json(error)
        }

    },
    update: async(req,res) => {

        // add filter based on user ID
        let requestData = req.body.itemChangeState
        console.log(requestData)
        let changedData = Object.keys(requestData) 
        let user = jwt.verify(req.headers.user,process.env.JWT_SECRET)
        try {
            for (let i = 0; i < changedData.length; i++) {
                let changedItem = changedData[i]

                const originalData = await itemModel.findOne(
                    {'userID.email':user.email,
                    receiptID: requestData[changedItem].receiptID,
                    deletedByUser:false, 
                    slug:changedItem})

                let changedItemCategory = originalData.itemCategory
                let changedItemQuantity = originalData.itemQuantityUpdatedByUser
                let changedDeleted = originalData.deletedByUser

                const changedDataKeys = Object.keys(requestData[changedItem])
                
                if(changedDataKeys.includes('itemCategory')) {
                    changedItemCategory = requestData[changedItem].itemCategory
                }
                if(changedDataKeys.includes('itemQuantityUpdatedByUser')) {
                    changedItemQuantity = requestData[changedItem].itemQuantityUpdatedByUser
                }
                if(changedDataKeys.includes('deletedByUser')) {
                    changedDeleted = requestData[changedItem].deletedByUser
                }
            
                const updatedProduct = await itemModel.findOneAndUpdate(
                    {'userID.email':user.email,
                    receiptID: requestData[changedItem].receiptID,
                    deletedByUser:false, 
                    slug:changedItem}, 
                    {itemCategory: changedItemCategory,
                    itemQuantityUpdatedByUser: changedItemQuantity,
                    deletedByUser: changedDeleted
                    },
                    {options: {
                        new:true
                    }})
                console.log(updatedProduct)
            }
            return res.json()

        } catch (error) {
            console.log(error)
            return res.json(error)
        }  
    }
}