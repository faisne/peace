const mongoose = require('mongoose')
const config = require('./config')
require('dotenv').config()
const Blog = require('../models/blog')

const main = async () => {
    await mongoose.connect(process.env.TEST_MONGODB_URI)

    console.log( 
        //await Blog.findByIdAndUpdate('62ab40b4fea0a2d44a08d5fc', {likes: 1}) 
        Blog.deleteMany({})
    )

    mongoose.connection.close()
}

main()