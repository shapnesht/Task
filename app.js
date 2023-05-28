require('dotenv').config()
require('express-async-errors')

// express
const express = require('express')
const app = express()

// other packages
const morgan = require('morgan')
const cookie = require('cookie-parser')

// database
const connectDB = require('./database/db')

// error handlers
const notFound = require('./middlewares/not-found')
const errorHandler = require('./middlewares/error-handler')

// routes
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')

// middlewares
app.use(express.json())
app.use(morgan('tiny'))
app.use(cookieParser(process.env.JWT_SECRET))

// controllers
app.use('/api/v1/auth', authRoutes)

// error handlers
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server is listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
