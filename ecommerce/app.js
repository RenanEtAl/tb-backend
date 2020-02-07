const express = require('express')
const mongoose = require('mongoose')

const app = express()
require('dotenv').config()

const userRoutes = require('./routes/user')

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('DB connected')
})

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
})


// routes middleware
app.use('/api', userRoutes)

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})