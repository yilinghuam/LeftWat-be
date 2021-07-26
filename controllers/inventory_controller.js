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

        let requestData = req.body.headers.itemChangeState
        let changedData = Object.keys(requestData) 
        let user = jwt.verify(req.body.headers.user,process.env.JWT_SECRET)


        for (let i = 0; i < changedData.length; i++) {
            let changedItem = changedData[i]

            const originalData = await itemModel.findOne(
                {'userID.email':user.email,
                deletedByUser:false, 
                slug:changedItem})

            let changedItemCategory = originalData.itemCategory
            let changedItemQuantity = originalData.itemQuantityUpdatedByUser
            let changedDeleted = originalData.deletedByUser

            const changedDataKeys = Object.keys(requestData[changedItem])
            
            if(changedDataKeys.includes('itemCategory')) {
                changedItemCategory = exampleData[changedItem].itemCategory
            }
            if(changedDataKeys.includes('itemQuantityUpdatedByUser')) {
                changedItemQuantity = exampleData[changedItem].itemQuantityUpdatedByUser
            }
            if(changedDataKeys.includes('deletedByUser')) {
                changedDeleted = exampleData[changedItem].deletedByUser
            }

            try {
                const updatedProduct = await itemModel.findOneAndUpdate(
                    {'userID.email':user.email,
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
            } catch (error) {
                console.log(error)
            }       
        }
  
    }
}