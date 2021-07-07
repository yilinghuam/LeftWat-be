const { parsed: CONFIGS } = require('dotenv').config()
const db = require('..')
const data = require('./data/receipt1.json')
const { ItemPurchased } = require('../../models')

db.executeScript(CONFIGS.DB_URI, async (connection) => {
    try {
        await connection.dropCollection(ItemPurchased.collection.collectionName)
        await ItemPurchased.insertMany(data)
        console.log('Seeding complete')
    } catch (err) {
        console.log(err)
    }
})