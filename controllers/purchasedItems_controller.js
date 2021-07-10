require('dotenv').config()
const _ = require('lodash')
const moment = require('moment')
const mongoose = require('mongoose')
const { testUploadModel } = require('../models/testUploadModel')
const Client = require('@veryfi/veryfi-sdk')

module.exports = {

    index: async (req, res) => {
        try {
            let testItems = await testUploadModel.find()
            return res.json(testItems)
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
        const file_path = req.file.path

        // 2. Click UPLOAD button
        // 2a) Run OCR API and return json data
        let veryfi_client = new Client(client_id, client_secret, username, api_key)
        
        // run local for testing (+ delete file from veryfi inbox)
        // let response = veryfi_client.process_document(file_path, [], true)

        // run upload feature for user (POSTMAN) (+ delete file from veryfi inbox)
        let response = veryfi_client.process_document(file_path, [], true)

        response.then(resp => {
            
            let purchasedItem = resp.line_items

            function cleanName(string) {
                return string.slice(0,-8)
            }

            for (let i = 0; i < purchasedItem.length; i++) {
                console.log(`Name: ${cleanName(purchasedItem[i].description)} | Quantity: ${purchasedItem[i].quantity} | Price: ${purchasedItem[i].price}`)

                // 2b) Save json data to MongoDB
                const timestampNow = moment().utc()

                testUploadModel.updateOne(
                    { itemName: cleanName(purchasedItem[i].description) },
                    {
                        $push: {
                            itemQuantity: purchasedItem[i].quantity,
                            itemPrice: purchasedItem[i].price
                        },
                        $set: { 
                            updated_at: timestampNow
                        }
                    },
                    {
                        upsert: true,
                    }
                )
                    .then(uploadResp => {
                        console.log('Uploaded to MongoDB successfully!')
                        return
                    })
                    .catch(err => {
                        console.log('Gaby, error with MongoDB integration')
                        return
                    })
            }

            return
            
        }).catch(err => {
            console.log('Gaby, error with Veryfi integration')
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