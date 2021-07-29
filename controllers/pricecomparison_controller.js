require('dotenv').config()
const _ = require('lodash')
const moment = require('moment')
const mongoose = require('mongoose')
const { itemModel } = require('../models/Item')
const jwt = require('jsonwebtoken')

module.exports = {
    index: async(req,res) => {

        try {
            const listData = await itemModel.find({},'itemName -_id').exec()
            // need to include 5 most recent receipt data  that 
            console.log(listData)
            let newlist = new Set()
            listData.map(elem => newlist.add(elem.itemName))
            newlist = Array.from(newlist)
            console.log(newlist)
            return res.json(newlist)
        } catch (error) {
            res.statusCode = 400
            console.log(error)
            return res.json(error)
        }
    },

    show: async(req,res) => {
        let item = _.kebabCase(req.headers.query)
        try {
            const itemData = await itemModel.aggregate([
                {$match:{'userID.email':req.email,slug:item}},
                {$group:{
                    slug:item,
                    itemPrice: {$push: "$itemPrice"},
                    maxPrice: {$max: "$itemPrice"},
                    minPrice: {$min:"$itemPrice"},
                    averagePrice: {$avg:"$itemPrice"},
                    itemLabel: {$push: {$dateToString: {format:"%Y-%m-%d", date:"$createdAt"}}}
                }}
            ],function(err, result) {
                console.log(result);
                console.log(err)
          })
            // const allItemData = await itemModel.find({slug:item})
            // need to include 5 most recent receipt data  that 
            console.log(itemData)
            // itemName,itemPrice,createdAt
            
            return res.json(itemData)
        } catch (error) {
            res.statusCode = 400
            console.log(error)
            return res.json(error)
        }
    }
}