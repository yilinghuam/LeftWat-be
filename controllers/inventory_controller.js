require('dotenv').config()
const _ = require('lodash')
const moment = require('moment')
const mongoose = require('mongoose')
const { itemModel } = require('../models/Item')

module.exports = {
    index: async(req,res) => {

        // retrieve emailidentification from jwt token first and receiptID based on email
        let user = req.headers.user
        let receiptID = [2021070712345,2021070712346,2021070712347,2021070712348,2021070712349]
        // retrieve 5 most recent receipt data that is not deleted
        try {
            const productData = await itemModel.find(
                {
                    userID:user, 
                    deletedByUser:false, 
                    receiptID: {$in:receiptID}
                })
            // need to include 5 most recent receipt data  that 
            return res.json(productData)
        } catch (error) {
            res.statusCode = 400
            return res.json(error)
        }

    },
    update: async(req,res) => {

        // add filter based on user ID

        let requestData = req.body.headers.itemChangeState
        let changedData = Object.keys(requestData) 

        for (let i = 0; i < changedData.length; i++) {
            let changedItem = changedData[i]

            const originalData = await itemModel.findOne({slug:changedItem})

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
                    {slug:changedItem}, 
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