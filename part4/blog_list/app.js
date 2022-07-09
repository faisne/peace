const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const { tokenExtractor, userExtractor, errorHandler } = require('./utils/middleware')
const loginRouter = require('./controllers/login')

mongoose.connect(config.MONGODB_URI)

app.use(express.json())
app.use('/api/blogs', tokenExtractor, userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') { 
    const testingRouter = require('./controllers/testing')  
    app.use('/api/testing', testingRouter) 
    console.log('added testing router')
}

app.use(errorHandler)


module.exports = app
