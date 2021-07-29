require('dotenv').config()
const _ = require('lodash')
const moment = require('moment')
const mongoose = require('mongoose')
const { itemModel } = require('../models/Item')
const jwt = require('jsonwebtoken')

module.exports = {
    index: async(req,res) => {

        try {
            const listData = await itemModel.find({},'itemName').exec()
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