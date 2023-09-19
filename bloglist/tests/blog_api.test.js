const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// const Blog = require('../models/blog')


test('return all blogs', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 10000)

test('verify blogs id is defined id', async () => {
  const resp = await api.get('/api/blogs')
  resp.body.forEach( (r) => {
    expect(r.id).toBeDefined()
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Blog created in test',
    author: 'Dermot',
    url: '/test/blog',
    likes: 7
  }
  const blogsAtStart = await api.get('/api/blogs')

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(blogsAtStart.body.length + 1)
  const titles = response.body.map(r => r.title)
  expect(titles).toContain('Blog created in test')
})

afterAll(async () => {
  await mongoose.connection.close()
})