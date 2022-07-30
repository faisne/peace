import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


const user = {
    token: 'asdf',
    id: 'asdf',
    username: 'many'
}
const blog = {
    title: '10 best ways to die',
    author: 'Masha B',
    url: 'myblog.masha.org',
    likes: 5,
    user: { id: user.id, username: user.username }
}
const blogs = [blog]
const showAlert = () => true
const setBlogs = () => true


test('title & author shown, details hidden', () => {
    const { container } = render(<Blog pars={[user, blog, blogs, setBlogs, showAlert]} />)
    expect(container.querySelector('.blog-details')).toHaveStyle('display: none')
    expect(screen.getByText('10 best ways to die, Masha B')).toBeDefined()
})

test('expand button shows details', async () => {
    const { container } = render(<Blog pars={[user, blog, blogs, setBlogs, showAlert]} />)
    const button = screen.getByText('Expand')
    await userEvent.setup().click(button)
    expect(container.querySelector('.blog-details')).toHaveStyle('display: block')
})

test('two clicks make two calls', async () => {
    const mockHandler = jest.fn()
    const userSetup = userEvent.setup()
    render(<Blog pars={[user, blog, blogs, setBlogs, showAlert]} handleLike={mockHandler} />)
    const button = screen.getByText('Like')
    await userSetup.click(button)
    await userSetup.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
})