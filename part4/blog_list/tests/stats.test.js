const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('1 blog 5 likes', () => {
        const result = listHelper.totalLikes([{ likes: 5 }])
        expect(result).toBe(5)
    })

    test('2 blogs 10 likes', () => {
        const blogs = [{ likes: 7 }, { likes: 3 }]
        expect(listHelper.totalLikes(blogs)).toBe(10)
    })

    test('5 blogs 0 likes', () => {
        const blogs = [
            { likes: 0 },
            { likes: 0 },
            { likes: 0 },
            { likes: 0 }, 
            { likes: 0 }
        ]
        expect(listHelper.totalLikes(blogs)).toBe(0)
    })
})

describe('favorite blog', () => {
    test('2 blogs 2 & 5 likes', () => {
        const result = listHelper.favoriteBlog([{likes: 5}, {likes: 2}])
        expect(result).toEqual({likes: 5})
    })
    test('1 blog', () => {
        const result = listHelper.favoriteBlog([{ likes: 5 }])
        expect(result).toEqual({ likes: 5 })
    })
    test('5 blogs max 10 likes', () => {
        const blogs = [
            { likes: 5 },
            { likes: 0 },
            { likes: 3 },
            { likes: 10 },
            { likes: 1 }
        ]
        expect(listHelper.favoriteBlog(blogs)).toEqual({ likes: 10 })
    })
    test('blog with extra info', () => {
        const blogs = [
            { likes: 5, author: 'max' },
            { likes: 0, author: 'sam' },
            { likes: 3, author: 'mary' },
            { likes: 10, author: 'anna' },
            { likes: 1, author: 'dan' }
        ]
        expect(listHelper.favoriteBlog(blogs)).toEqual({ likes: 10, author: 'anna' })
    })
    test('all zero', () => {
        const blogs = [
            { likes: 0, author: 'max' },
            { likes: 0, author: 'sam' },
            { likes: 0, author: 'mary' },
            { likes: 0, author: 'anna' },
            { likes: 0, author: 'dan' }
        ]
        expect(listHelper.favoriteBlog(blogs)).toEqual({ likes: 0, author: 'max' })
    })
})

describe('most blogs', () => {
    test('no blogs', () => {
        const blogs = []
        expect(listHelper.mostBlogs(blogs)).toEqual({})
    })
    test('1 blog', () => {
        const blogs = [{author: 'max'}]
        expect(listHelper.mostBlogs(blogs)).toEqual({author: 'max', blogs: 1})
    })
    test('5 blogs, max 3', () => {
        const blogs = [
            { author: 'max' },
            { author: 'anna' },
            { author: 'max' },
            { author: 'anna' },
            { author: 'max' }
        ]
        expect(listHelper.mostBlogs(blogs)).toEqual({ author: 'max', blogs: 3 })
    })
    test('max, anna, max, anna', () => {
        const blogs = [
            { author: 'max' },
            { author: 'anna' },
            { author: 'max' },
            { author: 'anna' }
        ]
        expect(listHelper.mostBlogs(blogs)).toEqual({ author: 'max', blogs: 2 })
    })
})

describe('most likes', () => {
    test('empty', () => {
        const blogs = []
        expect(listHelper.mostLikes(blogs)).toEqual({})
    })
    test('anna 5x3, max 5x2', () => {
        const blogs = [
            { author: 'anna', likes: 5 },
            { author: 'max', likes: 5 },
            { author: 'anna', likes: 5 },
            { author: 'max', likes: 5 },
            { author: 'anna', likes: 5 }
        ]
        expect(listHelper.mostLikes(blogs)).toEqual({author: 'anna', likes: 15})
    })
    test('anna 0x3, max 0x2', () => {
        const blogs = [
            { author: 'anna', likes: 0 },
            { author: 'max', likes: 0 },
            { author: 'anna', likes: 0 },
            { author: 'max', likes: 0 },
            { author: 'anna', likes: 0 }
        ]
        expect(listHelper.mostLikes(blogs)).toEqual({ author: 'anna', likes: 0 })
    })
    test('anna 3+3+5, max 6+5', () => {
        const blogs = [
            { author: 'anna', likes: 3 },
            { author: 'max', likes: 6 },
            { author: 'anna', likes: 3 },
            { author: 'max', likes: 5 },
            { author: 'anna', likes: 5 }
        ]
        expect(listHelper.mostLikes(blogs)).toEqual({ author: 'anna', likes: 11 })
    })
})