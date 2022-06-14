const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer '))
        request.token = authorization.substring(7)

    next()
}

const userExtractor = (request, response, next) => {
    if (request.token)
        request.user = jwt.verify(request.token, config.SECRET).id

    next()
}

const errorHandler = (error, request, response, next) => {
    switch (error.name) {
    case 'CastError': return response.status(400).send('malformatted id')
    case 'ValidationError': return response.status(400).send(error.message)
    default: next(error)
    }
}

module.exports = { tokenExtractor, userExtractor, errorHandler }