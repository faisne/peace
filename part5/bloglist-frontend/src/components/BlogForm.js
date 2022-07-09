import { useState } from "react"
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const BlogForm = ({ user, blogs, setBlogs, showAlert, testfn }) => {
    const [formVisible, setFormVisible] = useState('none')
    const [formDisabled, setFormDisabled] = useState(false)
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    
    const handleAdd = async (event) => {
        event.preventDefault()
        if (testfn) testfn({ title, url, author })
        else {
            await setFormDisabled(true)
            try {
                const newBlog = await blogService.create({ title, url, author }, user.token)
                newBlog.user = {id: user.id, username: user.username}
                setBlogs(blogs.concat(newBlog))
                setTitle('')
                setAuthor('')
                setUrl('')
                setFormVisible('none')
                showAlert('success', 'Blog added')
            }
            catch (e) { showAlert('error', e.response.data) }
            finally { setFormDisabled(false) }
        }
    }

    return (<>
        <button type="button" style={{ display: formVisible ? '' : 'none' }} onClick={() => setFormVisible('')}>Add blog...</button>
        <form onSubmit={handleAdd} style={{display: formVisible}}>
            <fieldset disabled={formDisabled}>
                <label>
                    <span>Title</span>
                    <input type="text" value={title} onChange={({ target }) => setTitle(target.value)} />
                </label>
                <label>
                    <span>Author</span>
                    <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)} />
                </label>
                <label>
                    <span>URL</span>
                    <input type="text" value={url} onChange={({ target }) => setUrl(target.value)} />
                </label>
                <div className="buttons">
                    <button>Add</button> <button type="button" onClick={() => setFormVisible('none')}>Cancel</button>
                </div>
            </fieldset>
        </form>
    </>)
}

BlogForm.propTypes = {
    user: PropTypes.object.isRequired,
    blogs: PropTypes.array.isRequired,
    setBlogs: PropTypes.func.isRequired, 
    showAlert: PropTypes.func.isRequired
}

export default BlogForm