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

    }
}