// =======================
//      DEPENDENCIES
// =======================
const { parsed: CONFIGS } = require('dotenv').config()
const express = require('express')
require('express-async-errors')
const db = require('./db')
const appRouter = require('./routers')

// =======================
//      HOST
// =======================
const app = express()
const { PORT, DB_URI } = CONFIGS

db.connect(DB_URI, async () => {
    await app.listen(PORT)
    console.log(`LeftWat backend app started on port: ${PORT}`)
})