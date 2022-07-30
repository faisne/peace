const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('hunter2', 10)
    const user = new User({ username: 'faisne', passwordHash })

    await user.save()
})

describe('login', () => {
    test('correct login & password => token length 175', async () => {
        const user = { username: 'faisne', password: 'hunter2' }
        const result = await api.post('/api/login').send(user)
        expect(result.body.token).toHaveLength(175)
    })
    test('wrong password => 401 Invalid username', async () => {
        const user = { username: 'faisne', password: 'abc' }
        const result = await api.post('/api/login').send(user).expect(401)
        expect(result.text).toContain('Invalid username')
    })
})

describe('create user', () => {
    test('no password => 400 Password required', async () => {
        const user = { username: 'benny' }
        const result = await api.post('/api/users').send(user).expect(400)
        expect(result.text).toContain('Password is required')
    })

    test('empty password => 400 Password required', async () => {
        const user = { username: 'benny', password: '' }
        const result = await api.post('/api/users').send(user).expect(400)
        expect(result.text).toContain('Password is required')
    })

    test('short password => 400 at least 3 characters', async () => {
        const user = { username: 'benny', password: '12' }
        const result = await api.post('/api/users').send(user).expect(400)
        expect(result.text).toContain('at least 3 characters')
    })

    test('no username => 400 Username required', async () => {
        const user = { password: 'benny' }
        const result = await api.post('/api/users').send(user).expect(400)
        expect(result.text).toContain('is required')
    })

    test('short username => 400 at least 3 characters', async () => {
        const user = { username: 'be', password: '123' }
        const result = await api.post('/api/users').send(user).expect(400)
        expect(result.text).toContain('at least 3 characters')
    })

    test('existing username => 400 Username taken', async () => {
        const user = { username: 'faisne', password: '123' }
        const result = await api.post('/api/users').send(user).expect(400)
        expect(result.text).toContain('is taken')
    })

    test('valid username & password => 201 <username>', async () => {
        const user = { username: 'new', password: '123' }
        await api.post('/api/users').send(user)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const result = await api.get('/api/users')
        const names = result.body.map(us => us.username)
        expect(names).toContain(user.username)
    })
})


afterAll(() => {
    mongoose.connection.close()
})