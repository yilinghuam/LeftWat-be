// =======================
//      DEPENDENCIES
// =======================
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const itemRouter = require('./routers/purchasedItems_router')
const userRouter = require('./routers/user_router')

// =======================
//      HOST
// =======================
const app = express()
const port = process.env.PORT || 7000
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

// setting middleware to accept json and urlencoded request body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/item', itemRouter)
app.use('/api/v1/user', userRouter)

mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(response => {
    app.listen(port, () => {
      console.log(`LeftWat app listening on port: ${port}`)
    })
  })