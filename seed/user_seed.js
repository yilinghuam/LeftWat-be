require('dotenv').config();
const mongoose =  require('mongoose');
const _ = require('lodash');
const { userModel } = require('../models/User');

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`

//data 
let data = [
    {
        email: 'abc@hotmail.com',
        hashedValue: 'abaubfq3i4btiqh4bfiqbfibq3igbjevbr9ubvadjvbaiebrfi',
    },
    {
        email: 'abcdef@hotmail.com',
        hashedValue: 'abaubfq3i4btiqh4bfiqbfibq3igbjevbr9ubvadjvbaiebrfi',
    },
    {
        email: 'abcdefghi@hotmail.com',
        hashedValue: 'abaubfq3i4btiqh4bfiqbfibq3igbjevbr9ubvadjvbaiebrfi',
    },
    {
        email: 'abc123@hotmail.com',
        hashedValue: 'abaubfq3i4btiqh4bfiqbfibq3igbjevbr9ubvadjvbaiebrfi',
    },
    {
        email: 'abc456@hotmail.com',
        hashedValue: 'abaubfq3i4btiqh4bfiqbfibq3igbjevbr9ubvadjvbaiebrfi',
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