const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjs = helper.initialBlogs
    .map(b => new Blog(b))
  const promiseArray = blogObjs.map(b => b.save())
  await Promise.all(promiseArray)
})

describe('All blogs are returned', () => {
  test('return all blogs', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDB()
    expect(response).toHaveLength(helper.initialBlogs.length)
  }, 10000)
})

describe('Verification of id definition', () => {
  test('verify blogs id is defined as id', async () => {
    const resp = await api.get('/api/blogs')
    resp.body.forEach( (r) => {
      expect(r.id).toBeDefined()
    })
  })
})

describe('Blog creation', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Blog created in test',
      author: 'Dermot',
      url: '/test/blog',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDB()
    expect(response).toHaveLength(helper.initialBlogs.length + 1)
    const titles = response.map(r => r.title)
    expect(titles).toContain('Blog created in test')
  })
})

describe('Default behaviour', () => {
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

    const response = await helper.blogsInDB()
    const result = response.find(r => r.title === 'Empty likes value')
    expect(result.likes).toEqual(0)
  })

})

describe('Rejecting missing values', () => {
  test('blogs without title rejected', async () => {
    const blogWithoutTitle = {
      author: 'Invalid Title',
      url: '/test/blog',
      likes: 9
    }
    await api
      .post('/api/blogs')
      .send([blogWithoutTitle])
      .expect(400)
    const response = await helper.blogsInDB()
    expect(response.map(r => r.author)).not.toContain('Invalid Title')
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

    const response = await helper.blogsInDB()
    expect(response.map(r => r.title)).not.toContain('Blog without URL')

  })
})

describe('Deleting and Updating blogs', () => {
  test('blogs can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    const contents = blogsAtEnd.map(b => b.id)
    expect(contents).not.toContain(blogToDelete.id)
  })

  test('blogs can be updated', async () => {
    const allBlogs = await helper.blogsInDB()
    const blogToUpdate = allBlogs[0]

    const updatedLikes = { ...blogToUpdate, likes: 91 }

    await api
      .put(`/api/blogs/${updatedLikes.id}`)
      .send(updatedLikes)
      .expect(204)

    const blogAfterUpdate = await helper.blogsInDB()
    expect(blogAfterUpdate[0].likes).toEqual(91)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})