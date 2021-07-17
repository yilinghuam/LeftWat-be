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
        let changedData = req.headers.itemChangeState
        let exampleData = {
            milk: {
                itemCategory: 'Vegetable',
                itemQuantityUpdatedByUser: '3'
            },
            spinach: {
                itemCategory:'Meat',
                deletedByUser: false
            }
        }
        let changedDateKeys = Object.keys(changedData) 

        try {
            const updatedProduct = await itemModel.update()
        } catch (error) {
            
        }
    }
}