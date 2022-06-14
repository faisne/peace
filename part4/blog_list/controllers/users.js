const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
require('express-async-errors')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title: 1, url: 1, author: 1})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!password)
        return response.status(400).send('Password is required')
    if (password.length < 3)
        return response.status(400).send('Password should be at least 3 characters long')
    if (await User.findOne({ username }))
        return response.status(400).send('Username is taken')

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })
    const result = await user.save()
    response.status(201).json(result)
})


module.exports = usersRouter