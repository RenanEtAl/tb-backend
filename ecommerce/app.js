const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const cors = require('cors')
const app = express()
require('dotenv').config()

// import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user.js')
const categoryRoutes = require('./routes/category.js')
const productRoutes = require('./routes/product');

mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() =>
        console.log('DB connected')
    )

// mongoose.connection.on('error', err => {
//     console.log(`DB connection error: ${err.message}`)
// })

// middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors()) //handle the request coming from different origin/port

// routes middleware
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})