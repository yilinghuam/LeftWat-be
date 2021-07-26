require('dotenv').config();
const mongoose =  require('mongoose');
const _ = require('lodash');
const { itemModel } = require('../models/Item.js');

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`

//data 
let data = [
    {
        userID: { 
            email: 'abc12345@hotmail.com',
            profileType: 'public'
        },
        receiptID: 202107240,
        itemName: "Apple",
        itemCategory: "Others",
        itemPrice: 1,
        itemPriceTotal: 12,
        itemQuantityAtUpload: 12,
        itemQuantityUpdatedByUser: 12,
        deletedByUser: false,
    },
    {
        userID: { 
            email: 'abc12345@hotmail.com',
            profileType: 'public'
        },        
        receiptID: 202107240,
        itemName: "Pear",
        itemCategory: "Others",
        itemPrice: 3,
        itemPriceTotal: 12,
        itemQuantityAtUpload: 4,
        itemQuantityUpdatedByUser: 4,
        deletedByUser: false,
    },
    {
        userID: { 
            email: 'abc12345@hotmail.com',
            profileType: 'public'
        },
        receiptID: 202107240,
        itemName: "Chips",
        itemCategory: "Others",
        itemPrice: 5,
        itemPriceTotal: 10,
        itemQuantityAtUpload: 2,
        itemQuantityUpdatedByUser: 2,
        deletedByUser: false,
    },
    {
        userID: { 
            email: 'abc12345@hotmail.com',
            profileType: 'public'
        },
        receiptID: 202107241,
        itemName: "Spinach",
        itemCategory: "Others",
        itemPrice: 3,
        itemPriceTotal: 15,
        itemQuantityAtUpload: 5,
        itemQuantityUpdatedByUser: 5,
        deletedByUser: false,
    },
    {
        userID: { 
            email: 'abc12345@hotmail.com',
            profileType: 'public'
        },
        receiptID: 202107241,
        itemName: "Milk",
        itemCategory: "Others",
        itemPrice: 8,
        itemPriceTotal: 2,
        itemQuantityAtUpload: 4,
        itemQuantityUpdatedByUser: 4,
        deletedByUser: false,
    }
]
console.log(data)
let newdata = data.map(elem => {
    elem.slug = _.kebabCase(elem.itemName)
    return elem
})
console.log(newdata)

let connection = null;

//connect to mongodb via mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
    .then(connResp => {
        connection = connResp
        return itemModel.insertMany(newdata)
    })
    .then(insertResp => {
        console.log('successful item data insertion')
    })
    .catch(err => {
        console.log(err)
    })
    .finally(() => {
        if (connection !== null) {
            connection.disconnect()
        }
    })