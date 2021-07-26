require('dotenv').config();
const mongoose =  require('mongoose');
const _ = require('lodash');
const { userModel } = require('../models/User');

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`

//data 
let data = [
    {
        email: 'abc12345@hotmail.com',
        hashedValue: '$2b$10$NHtxyCuo/BfhNkM4GtZiv.qyjMIr9Ohsd/gbrOR/S5m4CCdUpJi72',
        cloudinaryReceipts: ['test0@test.com', 'test1@test.com', 'test2@test.com', 'test3@test.com'],
        receiptArray: [202107240, 202107241, 202107242, 202107243]
    },
    {
        email: 'abcdef@hotmail.com',
        hashedValue: '$2b$10$NHtxyCuo/BfhNkM4GtZiv.qyjMIr9Ohsd/gbrOR/S5m4CCdUpJi72',
    },
    {
        email: 'abcdefghi@hotmail.com',
        hashedValue: '$2b$10$NHtxyCuo/BfhNkM4GtZiv.qyjMIr9Ohsd/gbrOR/S5m4CCdUpJi72',
    },
    {
        email: 'abc123@hotmail.com',
        hashedValue: '$2b$10$NHtxyCuo/BfhNkM4GtZiv.qyjMIr9Ohsd/gbrOR/S5m4CCdUpJi72',
    },
    {
        email: 'abc456@hotmail.com',
        hashedValue: '$2b$10$NHtxyCuo/BfhNkM4GtZiv.qyjMIr9Ohsd/gbrOR/S5m4CCdUpJi72',
    },
]

let connection = null;

//connect to mongodb via mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
    .then(connResp => {
        connection = connResp
        return userModel.insertMany(data)
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