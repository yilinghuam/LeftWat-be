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

    index: async (req, res) => {
        try {
            let items = await itemModel.find()
            return res.json(items)
        } catch (err) {
            res.statusCode = 500
            return res.json(err)
        }
    },

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

        // 2. Click UPLOAD button
        // 2a) Run OCR API and return json data
        let veryfi_client = new Client(client_id, client_secret, username, api_key)
        
        // run local for testing (+ delete file from veryfi inbox)
        // let response = veryfi_client.process_document(file_path, [], true)

        // run upload feature for user (POSTMAN) (+ delete file from veryfi inbox)
        // process_document() for local files

        let response = await veryfi_client.process_document_url(file_path, [], true)

        try {
            
            let purchasedItem = response.line_items

            let receiptID = moment(timestampNow).format('YYYYMMDD') + '-' + randomstring.generate(5)

            for (let i = 0; i < purchasedItem.length; i++) {
                // 2b) Save json data to MongoDB
                
                const item = itemModel.create({
                    userID: [ req.email ,'public' ],
                    receiptID: receiptID,                    
                    itemName: purchasedItem[i].description,
                    itemCategory: 'Others',
                    itemPrice: purchasedItem[i].price,
                    itemPriceTotal: purchasedItem[i].total,
                    itemQuantityAtUpload: purchasedItem[i].quantity,
                    itemQuantityUpdatedByUser: purchasedItem[i].quantity,
                    deletedByUser: false,
                    slug: _.kebabCase(purchasedItem[i].description)
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
                    cloudinaryReceipts: file_path
                },
                $set: {
                    updated_at: timestampNow
                }
            }
        )
            .then(pushCloudinaryResp => {
                return
            })
            .catch(err => {
                console.log(err)
                return
            })
        
    },

    confirmReceipt: async (req, res) => {

        // OVERVIEW OF PROCESS LOGIC:
        // 1. Load mongoDB data in table
        // 2. Editable: name, quantity, price
        // 3. Click confirm button at bottom of table to push changes into mongoDB

    },
}