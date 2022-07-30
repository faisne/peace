const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
require('express-async-errors')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1}).populate('comments', {text: 1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    if (!request.user) 
        return response.status(401).send('token missing or invalid')
    
    if (!request.body.title && !request.body.url)
        return response.status(400).send('Title and URL are required')
    
    const blog = new Blog({ ...request.body, user: request.user })
    const result = await blog.save()
    const user = await User.findById(request.user)
    user.blogs = user.blogs.concat(result.id)
    await user.save()
    response.status(201).json(result)
})

blogsRouter.post('/:id/comments', async (request, response) => {
   if (!request.user)
      return response.status(401).send('token missing or invalid')

   if (!request.body.text)
      return response.status(400).send('Comment cannot be empty')

   const comment = new Comment({ text: request.body.text, blog: request.params.id })
   const result = await comment.save()
   const blog = await Blog.findById(request.params.id)
   blog.comments = [...blog.comments, result.id]
   await blog.save()
   response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    if (!request.user)
        return response.status(401).send('token missing or invalid')
    
    const blog = await Blog.findById(request.params.id)

    if (request.user !== blog.user.toString())
        return response.status(401).send('you can\'t delete this blog')
    
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const result = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, context: 'query' })
    res.json(result)
})

module.exports = blogsRouter