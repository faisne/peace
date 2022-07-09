import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

const title = 'My new blog'
const url = 'www.blog.net'
const author = 'Tanya'
const user = {}
const blogs = []
const setBlogs = () => true
const showAlert = () => true

test('blog form makes calls with correct data', async () => {
    const mockHandler = jest.fn()
    const userSetup = userEvent.setup()
    
    render(<BlogForm user={user} blogs={blogs} setBlogs={setBlogs} showAlert={showAlert} testfn={mockHandler} />)
    
    const titleInput = screen.getByLabelText('Title')
    const authorInput = screen.getByLabelText('Author')
    const urlInput = screen.getByLabelText('URL')
    const submit = screen.getByText('Add')
    
    await userSetup.type(titleInput, title)
    await userSetup.type(authorInput, author)
    await userSetup.type(urlInput, url)
    await userEvent.setup().click(submit)
    
    expect(mockHandler.mock.calls[0][0]).toEqual({ title, author, url })
})