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

        // 2. Click UPLOAD button
        // 2a) Run OCR API and return json data
        let veryfi_client = new Client(client_id, client_secret, username, api_key)
        
        // run local for testing (+ delete file from veryfi inbox)
        // let response = veryfi_client.process_document(file_path, [], true)

        // run upload feature for user (POSTMAN) (+ delete file from veryfi inbox)
        // process_document() for local files

        let response = await veryfi_client.process_document_url(file_path, [], true)

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
                return
            })
            .catch(err => {
                console.log(err)
                return
            })
        
    },

    loadReceipt: async (req,res) => {
        
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

        // add filter based on user ID

        // let requestData = req.body.headers.itemChangeState
        // let changedData = Object.keys(requestData) 

        // for (let i = 0; i < changedData.length; i++) {
        //     let changedItem = changedData[i]

        //     const originalData = await itemModel.findOne({slug:changedItem})

        //     let changedItemCategory = originalData.itemCategory
        //     let changedItemQuantity = originalData.itemQuantityUpdatedByUser
        //     let changedDeleted = originalData.deletedByUser

        //     const changedDataKeys = Object.keys(requestData[changedItem])
            
        //     if(changedDataKeys.includes('itemCategory')) {
        //         changedItemCategory = exampleData[changedItem].itemCategory
        //     }
        //     if(changedDataKeys.includes('itemQuantityUpdatedByUser')) {
        //         changedItemQuantity = exampleData[changedItem].itemQuantityUpdatedByUser
        //     }
        //     if(changedDataKeys.includes('deletedByUser')) {
        //         changedDeleted = exampleData[changedItem].deletedByUser
        //     }

        //     try {
        //         const updatedProduct = await itemModel.findOneAndUpdate(
        //             {slug:changedItem}, 
        //             {itemCategory: changedItemCategory,
        //             itemQuantityUpdatedByUser: changedItemQuantity,
        //             deletedByUser: changedDeleted
        //             },
        //             {options: {
        //                 new:true
        //             }})
        //         console.log(updatedProduct)
        //     } catch (error) {
        //         console.log(error)
        //     }

        //     {
        //         apple: {
        //             itemPriceTotal: 24, 
        //             itemPrice: “2”
        //             }
        //         chips: {
        //             itemPriceTotal: 8, 
        //             itemQuantityUpdatedByUser: “4"
        //             }
        //     }
        //     basically, three possible changes, itemPriceTotal, itemPrice and itemQuantityUpdatedByUser.
        //     itemPriceTotal will always change cause changing any of the other two will always affect total price
        // }

    },
}