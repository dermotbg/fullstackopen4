const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    'title': 'The very first blog',
    'author': 'Dermot',
    'url': 'blogs.com/testblog',
    'likes': 250,
    'id': '6503f9a9739798c005911e97'
  },
  {
    'title': 'Async/Await',
    'author': 'Thomas Aysynchronus',
    'url': '/testblog',
    'likes': 251,
    'id': '6503feaf3af0c7599888d4b3'
  },
  {
    'title': 'The ode to writing fake blogs',
    'author': 'Bloggy McBloggerson',
    'url': 'blogs.com/blogs/blogs?=blogg',
    'likes': 13,
    'id': '65040c8ada6394b863a12a3f'
  },
  {
    'title': 'Long John Silvers insight into React',
    'author': 'L.J.S.',
    'url': 'deepatlantic.com/blogs',
    'likes': 124,
    'id': '6509900605e9a3d313a4e1ce'
  },
  {
    'title': 'Bun is for bunnies',
    'author': 'Dermot',
    'url': '/testblog/updated',
    'likes': 55,
    'id': '650a9340d329d8a24724d5d2'
  }
]

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDB,
  usersInDb
}