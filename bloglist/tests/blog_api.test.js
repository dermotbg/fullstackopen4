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

afterAll(async () => {
  await mongoose.connection.close()
})