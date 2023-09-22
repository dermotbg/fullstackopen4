const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const { MDB_URI } = require('./utils/config')
const logger = require('./utils/logger')


mongoose.set('strictQuery', false)
mongoose.connect(MDB_URI)
  .then(() => {
    logger.info('connected to DB')
  })
  .catch(error => {
    logger.error('Error connecting to DB', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)

module.exports = app