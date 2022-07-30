const array = require('lodash/array')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => blog.likes + sum, 0)

const maxBy = (arr, par) => 
    arr.reduce((max, item) => item[par] > max[par] ? {...item} : {...max}, {...arr[0]})

const favoriteBlog = (blogs) => {
    return maxBy(blogs, 'likes')
}

const mostBlogs = (blogs) => {
    const authors = array.uniq(blogs.map(blog => blog.author)).map(a => { 
        return {author: a, blogs: blogs.filter(blog => blog.author == a).length} 
    })

    return maxBy(authors, 'blogs')
}

const mostLikes = (blogs) => {
    const authors = array.uniq(blogs.map(blog => blog.author)).map(a => {
        return {author: a, likes: blogs.reduce((sum, b) => sum + b.likes*(b.author == a), 0)}
    })
    return maxBy(authors, 'likes')
}


module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }