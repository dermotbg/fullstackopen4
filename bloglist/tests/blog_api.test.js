const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)


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

test('empty likes value defaults to zero', async () => {
  const newBlog = {
    title: 'Empty likes value',
    author: 'Dermot',
    url: '/test/blog'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const result = response.body.find(r => r.title === 'Empty likes value')
  expect(result.likes).toEqual(0)
})

describe('rejecting missing values', () => {

  test('blogs without title rejected', async () => {
    const blogWithoutTitle = {
      author: 'Dermot',
      url: '/test/blog',
      likes: 9
    }
    await api
      .post('/api/blogs')
      .send([blogWithoutTitle])
      .expect(400)
  })
  test('blogs without url will be rejected', async () => {
    const blogWithoutURL = {
      title: 'Blog without URL',
      author: 'Dermot',
      likes: 5
    }
    await api
      .post('/api/blogs')
      .send(blogWithoutURL)
      .expect(400)
  })
})

test('blogs can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  expect(blogsAtEnd.body).toHaveLength(blogsAtStart.body.length - 1)
  const contents = blogsAtEnd.body.map(b => b.title)
  expect(contents).not.toContain(blogToDelete.id)
})

test('blogs can be updated', async () => {
  const allBlogs = await api.get('/api/blogs')
  const blogToUpdate = allBlogs.body[0]

  const updatedLikes = { ...blogToUpdate, likes: 91 }

  await api
    .put(`/api/blogs/${updatedLikes.id}`)
    .send(updatedLikes)
    .expect(204)

  const blogAfterUpdate = await api.get(`/api/blogs/${updatedLikes.id}`)
  expect(blogAfterUpdate.body.likes).toEqual(91)
})

afterAll(async () => {
  await mongoose.connection.close()
})