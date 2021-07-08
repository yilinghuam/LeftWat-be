require('dotenv').config();
const mongoose =  require('mongoose');
const _ = require('lodash');
const { PurchasedItemModel } = require('../models/PurchasedItem');

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`

//data 
let data = [
    {
        "userID": ["user1", "public"],
        "receiptID": 2021070712345,
        "itemName": "Apple",
        "itemCategory": "Others",
        "itemBrand": "Meadows",
        "priceOfItem": 1,
        "priceTotal": 12,
        "countAtPointOfUpload": 12,
        "countUpdatedByUser": 8,
        "deleted": false
    }
]

let connection = null;

//connect to mongodb via mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
    .then(connResp => {
        connection = connResp
        return PurchasedItemModel.insertMany(data)
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