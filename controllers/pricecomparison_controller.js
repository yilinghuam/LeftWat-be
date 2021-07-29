require('dotenv').config()
const _ = require('lodash')
const moment = require('moment')
const mongoose = require('mongoose')
const { itemModel } = require('../models/Item')
const jwt = require('jsonwebtoken')

module.exports = {
    index: async(req,res) => {

        try {
            const listData = await itemModel.find({},
                {userID: 0,
                receiptID: 0,
                itemName: 1,
                itemCategory: 0,
                itemPrice: 0,
                itemPriceTotal: 0,
                itemQuantityAtUpload: 0,
                itemQuantityUpdatedByUser: 0,
                deletedByUser: 0,
                slug: 0}
                )
            // need to include 5 most recent receipt data  that 
            console.log(listData)
            return res.json(listData)
        } catch (error) {
            res.statusCode = 400
            console.log(error)
            return res.json(error)
        }

    }
}