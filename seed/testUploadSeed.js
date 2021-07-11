require('dotenv').config()
const mongoose = require('mongoose')
const _ = require('lodash')
const { testUploadModel } = require('../models/testUploadModel')

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`

let data = [
        { 
            itemName: 'Test Number 1', 
            itemQuantity: 11,
            itemPrice: 1.11
        },
        { 
            itemName: 'Test Number 2', 
            itemQuantity: 22,
            itemPrice: 2.22
        }
]

let connection = null

mongoose.connect( mongoURI, {useNewUrlParser: true, useUnifiedTopology: true} )
    .then(connResp => {
        connection = connResp
        return testUploadModel.insertMany(data)
    })
    .then(insertResp => {
        console.log('successful data insertion')
    })
    .catch(err => {
        console.log(err)
    })
    .finally(() => {
        if (connection !== null) {
            connection.disconnect()
        }
    })