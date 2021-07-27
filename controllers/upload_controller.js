require('dotenv').config()
const _ = require('lodash')
const moment = require('moment')
const mongoose = require('mongoose')
const randomstring = require('randomstring')
const { itemModel } = require('../models/Item')
const Client = require('@veryfi/veryfi-sdk')
const { userModel } = require('../models/User')

const timestampNow = moment().utc()

module.exports = {

    uploadReceipt: async (req, res) => {

        // setting up OCR API access
        const client_id = process.env.CLIENT_ID
        const client_secret = process.env.CLIENT_SECRET
        const username = process.env.USERNAME
        const api_key = process.env.API_KEY

        // OVERVIEW OF PROCESS LOGIC:
        // 1. Choose file to upload
        // 2. Click upload button to:
        //     2a) run OCR API and return json data
        //     2b) save json data into mongoDB collection

        // 1. Choose/declare file for upload

        // path for local for testing
        // const file_path = './public/redmart-sample.pdf'

        // path for upload feature for user (POSTMAN)
        const file_path = await req.file.path
        console.log(file_path)
        // 2. Click UPLOAD button
        // 2a) Run OCR API and return json data
        let veryfi_client = new Client(client_id, client_secret, username, api_key)
        
        // run local for testing (+ delete file from veryfi inbox)
        // let response = veryfi_client.process_document(file_path, [], true)

        // run upload feature for user (POSTMAN) (+ delete file from veryfi inbox)
        // process_document() for local files

        let response = await veryfi_client.process_document_url(file_path, [], true)
        console.log(response)
        let receiptID = moment(timestampNow).format('YYYYMMDD') + '-' + randomstring.generate(5)

        try {
            
            let purchasedItem = response.line_items

            for (let i = 0; i < purchasedItem.length; i++) {
                // 2b) Save json data to MongoDB
                
                const item = itemModel.create({
                    userID: {
                        email: req.email,
                        profileType: 'public' 
                        },
                    receiptID: receiptID,                    
                    itemName: purchasedItem[i].description,
                    itemCategory: 'Others',
                    itemPrice: purchasedItem[i].price,
                    itemPriceTotal: purchasedItem[i].total,
                    itemQuantityAtUpload: purchasedItem[i].quantity,
                    itemQuantityUpdatedByUser: purchasedItem[i].quantity,
                    deletedByUser: false,
                    slug: _.kebabCase(purchasedItem[i].description),
                    cloudinaryLink: file_path
                })

                console.log('Successful MongoDB insertion!')
            }

            res.json({ message: "uploaded!" })

        } catch (err) {
            console.log(err)
            return
        }

        //add cloudinary link to user
        userModel.updateOne(
            { email: req.email },
            {
                $push: { 
                    cloudinaryReceipts: file_path,
                    receiptArray: receiptID
                },
                $set: {
                    updated_at: timestampNow
                }
            }
        )
            .then(pushCloudinaryResp => {
                return res.json(receiptID)
            })
            .catch(err => {
                console.log(err)
                return
            })
        
    },

    loadReceipt: async (req, res) => {
        
        try {

            let userIdentified = await userModel.findOne({ email: req.email })
            // console.log(userIdentified)
            let latestReceiptIndex = userIdentified.receiptArray.length
            let latestReceiptID = userIdentified.receiptArray[latestReceiptIndex - 1]
            // console.log(latestReceiptID)

            const receiptData = await itemModel.find(
                {
                    receiptID: latestReceiptID
                }
            )

            console.log(receiptData)
            return res.send(receiptData)

        } catch(err) {
            console.log(err)
            res.statusCode = 400
            return res.json(err)
        }

    },

    confirmReceipt: async (req, res) => {

        // hardcoded FRONTEND data
        let exampleFrontendData = {
            'Dr Oetker Ristorante Formaggi Pizza - Frozen': {
                itemName: 'Dr Oetker Ristorante Formaggi Pizza - Frozen',
                itemPrice: 4,
                itemQuantityUpdatedByUser: 4,
                itemPriceTotal: 16
            },
        }

        let requestedData = exampleFrontendData // req.body.headers.itemChangeState
        let toBeChangedData = Object.keys(requestedData) // returns array of strings 'itemA' and 'itemB'

        // loop through every 'item' string in the array
        for (let i = 0; i < toBeChangedData.length; i++) {

            // one grocery product; string = itemName
            let toBeChangedItem = toBeChangedData[i]

            // FROM BACKEND
            // originalData = object in mongoDB
            const originalData = await itemModel.findOne({ itemName: toBeChangedItem })

            // first take the original values from mongoDB backend
            let toBeChangedItemPrice = originalData.itemPrice
            // console.log('ItemPrice is originally ' + toBeChangedItemPrice)
            let toBeChangedItemQuantity = originalData.itemQuantityUpdatedByUser
            // console.log('Quantity is originally ' + toBeChangedItemQuantity)
            let toBeChangedItemPriceTotal = originalData.itemPriceTotal
            // console.log('Total price is originally ' + toBeChangedItemPriceTotal)

            // FROM FRONTEND
            // returns keys of a specific grocery product as an array of strings
            const toBeChangedItemKeys = Object.keys(requestedData[toBeChangedItem]) // 'itemName' 'itemPrice' etc.

            // now take the edited values from React frontend
            // if value is edited by user, FRONTEND data supercedes BACKEND data, else leave BACKEND data as-is
            if(toBeChangedItemKeys.includes('itemPrice')) {
                toBeChangedItemPrice = requestedData[toBeChangedItem].itemPrice
                // console.log('ItemPrice has been changed to ' + toBeChangedItemPrice)
            }
            if(toBeChangedItemKeys.includes('itemQuantityUpdatedByUser')) {
                toBeChangedItemQuantity = requestedData[toBeChangedItem].itemQuantityUpdatedByUser
                // console.log('Quantity has been changed to ' + toBeChangedItemQuantity)
            }
            if(toBeChangedItemKeys.includes('itemPriceTotal')) {
                toBeChangedItemPriceTotal = requestedData[toBeChangedItem].itemPriceTotal
                // console.log('Total price has been changed to ' + toBeChangedItemPriceTotal)
            }

            try {
                const updatedProduct = await itemModel.findOneAndUpdate(
                    { itemName: toBeChangedItem },
                    {
                        itemPrice: toBeChangedItemPrice,
                        itemQuantityUpdatedByUser: toBeChangedItemQuantity,
                        itemPriceTotal: toBeChangedItemPriceTotal,
                    },
                    { new: true }
                )

                console.log(updatedProduct)
            } catch (err) {
                console.log(err)
            }
            
        }

        res.json('Receipt data updated successfully!')

    },
}