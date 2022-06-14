const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('hunter2', 10)
    const user = new User({ username: 'faisne', passwordHash })

    await user.save()
    
    const initialBlogs = [
        {
            title: 'My favorite cats',
            author: 'Masha',
            url: 'http://cats.net',
            likes: 5,
            user: user.id
        },
        {
            title: 'Life in a cage',
            author: 'Vasya',
            url: 'http://cage-life-rules.net',
            likes: 8,
            user: user.id
        }
    ]

    await Blog.deleteMany({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    
    user.blogs = blogObjects.map(blog => blog.id)
    await user.save()
})

test('initial', async () => {
    const user = await User.findOne({})
    expect(user.blogs).toHaveLength(2)
})

describe('getting blogs', () => {
    test('there are two blogs', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(2)
    })

    test('id field is named "id"', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })
})

describe('creating blogs', () => {
    test('new blog sucessfully created', async () => {
        const user = { username: 'faisne', password: 'hunter2' }
        const authData = await api.post('/api/login').send(user)

        const blog = {
            title: 'Best cars',
            author: 'Benny',
            url: 'benny.bestcars.net',
            likes: 13
        }

        await api.post('/api/blogs')
            .send(blog)
            .set('Authorization', `bearer ${authData.body.token}`)
            .expect(201)
        
        const newBlogs = await api.get('/api/blogs')
        expect(newBlogs.body.map(b => b.title)).toContain(blog.title)
    })

    test('logged-in user is the creator of the blog', async () => {
        const user = { username: 'faisne', password: 'hunter2' }
        const authData = await api.post('/api/login').send(user)

        const blog = {
            title: 'Best cars',
            author: 'Benny',
            url: 'benny.bestcars.net',
            likes: 13,
        }

        const result = await api.post('/api/blogs')
            .send(blog)
            .set('Authorization', `bearer ${authData.body.token}`)
            .expect(201)
        
        const userInDB = await User.findOne({ username: user.username })
        
        expect(result.body.user).toBe(userInDB.id)
    })

    test('can\'t create blog without token', async () => {
        const blog = {
            title: 'Best cars',
            author: 'Benny',
            url: 'benny.bestcars.net',
            likes: 13
        }
        const result = await api.post('/api/blogs').send(blog).expect(401)
        expect(result.text).toContain('token missing')
    })

    test('can\'t create blog with empty token', async () => {
        const blog = {
            title: 'Best cars',
            author: 'Benny',
            url: 'benny.bestcars.net',
            likes: 13
        }
        const result = await api.post('/api/blogs')
            .set('Authorization', '')
            .send(blog)
            .expect(401)
        expect(result.text).toContain('token missing')
    })

    test('can\'t create blog with invalid token', async () => {
        const blog = {
            title: 'Best cars',
            author: 'Benny',
            url: 'benny.bestcars.net',
            likes: 13
        }
        const result = await api.post('/api/blogs')
            .set('Authorization', 'asdf')
            .send(blog)
            .expect(401)
        expect(result.text).toContain('token missing')
    })

    test('likes default to 0 if ommited', async () => {
        const user = { username: 'faisne', password: 'hunter2' }
        const authData = await api.post('/api/login').send(user)

        const blog = {
            title: 'Best cars',
            author: 'Benny',
            url: 'benny.bestcars.net'
        }
        const response = await api
            .post('/api/blogs')
            .send(blog)
            .set('Authorization', `bearer ${authData.body.token}`)
        expect(response.body.likes).toBe(0)
    })

    test('400 returned if title & url ommited', async () => {
        const user = { username: 'faisne', password: 'hunter2' }
        const authData = await api.post('/api/login').send(user)

        const blog = {
            author: 'Masha',
            likes: 11
        }

        await api
            .post('/api/blogs')
            .send(blog)
            .set('Authorization', `bearer ${authData.body.token}`)
            .expect(400)
    })
})

describe('delete blog', () => {
    test('can delete with proper authorization', async () => {
        const user = { username: 'faisne', password: 'hunter2' }
        const authData = await api.post('/api/login').send(user)

        let blogs = await api.get('/api/blogs')

        await api
            .delete(`/api/blogs/${blogs.body[0].id}`)
            .set('Authorization', `bearer ${authData.body.token}`)
            .expect(204)
        
        blogs = await api.get('/api/blogs')
        expect(blogs.body).toHaveLength(1)
    })

    test('can\'t delete without authorization', async () => {
        const blogs = await api.get('/api/blogs')

        const result = await api
            .delete(`/api/blogs/${blogs.body[0].id}`)
            .expect(401)

        expect(result.text).toContain('token missing')
    })

    test('can\'t delete other user\'s blog', async () => {
        const username = 'vasya'
        const password = '123'
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({ username, passwordHash })
        await user.save()

        const authData = await api.post('/api/login').send({ username, password })

        const blogs = await api.get('/api/blogs')

        const result = await api
            .delete(`/api/blogs/${blogs.body[0].id}`)
            .set('Authorization', `bearer ${authData.body.token}`)
            .expect(401)

        expect(result.text).toContain('can\'t delete this')
    })
})


test('likes updated', async () => {
    let res = await api.get('/api/blogs')
    expect(res.body[0].likes).not.toBe(15)
    await api.put(`/api/blogs/${res.body[0].id}`)
        .send({likes: 15})
    res = await api.get('/api/blogs')
    expect(res.body[0].likes).toBe(15)
})

afterAll(() => {
    mongoose.connection.close()
})