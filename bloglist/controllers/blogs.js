const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (_request, response) => {
  const notes = await Blog.find({})
  response.json(notes)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  const savedBlog = await blog.save()
  response.status(201).send(savedBlog)
})

module.exports = blogsRouter