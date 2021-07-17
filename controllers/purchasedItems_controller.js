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

            for (let i = 0; i < purchasedItem.length; i++) {
                // console.log(purchasedItem[i])
                // console.log(purchasedItem.length)

                // 2b) Save json data to MongoDB
                
                const item = itemModel.create({
                    userID: [ req.email ,'public' ],
                    receiptID: moment(timestampNow).format('YYYYMMDD') + '-' + randomstring.generate(5),                    
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

        // let response = veryfi_client.process_document_url(file_path, [], true)
        // console.log('response')
        // response.then(resp => {
            
        //     let purchasedItem = resp.line_items

        //     // function cleanName(string) {
        //     //     return string.slice(0,-8)
        //     // }

        //     for (let i = 0; i < purchasedItem.length; i++) {
        //         // console.log(purchasedItem[i])
        //         console.log(purchasedItem.length)
        //         // 2b) Save json data to MongoDB
        //         // const timestampNow = moment().utc()

        //         // every upload item will be a standalone document i.e. all repeat purchases will not be aggregated but unique documents
        //         itemModel.create({
        //             userID: [ req.email ,'public' ],
        //             receiptID: moment(timestampNow).format('YYYYMMDD') + '-' + randomstring.generate(5),                    
        //             itemName: purchasedItem[i].description,
        //             itemCategory: 'Others',
        //             itemPrice: purchasedItem[i].price,
        //             itemPriceTotal: purchasedItem[i].total,
        //             itemQuantityAtUpload: purchasedItem[i].quantity,
        //             itemQuantityUpdatedByUser: purchasedItem[i].quantity,
        //             deletedByUser: false,
        //             slug: _.kebabCase(purchasedItem[i].description)
        //         })
        //             .then(uploadResp => {
        //                 return `Uploaded to MongoDB successfully!`
        //             })
        //             .catch(err => {
        //                 console.log('Error with MongoDB integration')
        //                 console.log(err)
        //                 return
        //             })

        //     }
        //     return `done`
            
        // }).catch(err => {
        //     console.log('Error with Veryfi integration')
        //     console.log(err)
        //     return
        //     })
        //     console.log('2')

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