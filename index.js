// =======================
//      DEPENDENCIES
// =======================
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const uploadRouter = require('./routers/upload_router')
const landingRouter = require('./routers/landing_router')
const inventoryRouter = require('./routers/inventory_router')
const dashboardRouter = require('./routers/dashboard_router')
const pricecomparisonRouter = require('./routers/pricecomparison_router')
// =======================
//      HOST
// =======================
const app = express()
const port = process.env.PORT || 7000
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

//setting cors middleware
app.use(cors({ origin: '*' }))
//handling cors pre-flight requests across-the-board
app.options('*', cors())

//setting cookie-parser middleware
app.use(cookieParser())

// setting middleware to accept json and urlencoded request body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/upload', uploadRouter)
app.use('/api/v1/landing', landingRouter)
app.use('/api/v1/inventory',inventoryRouter)
app.use('/api/v1/dashboard',dashboardRouter)
app.use('/api/v1/pricecomparison',pricecomparisonRouter)

mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(response => {
    app.listen(port, () => {
      console.log(`LeftWat app listening on port: ${port}`)
    })
  })