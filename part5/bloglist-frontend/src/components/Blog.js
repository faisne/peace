import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({pars, handleLike}) => {
  const [user, blog, blogs, setBlogs, showAlert] = pars
  const [displayBlog, setDisplayBlog] = useState('none')

  if (!handleLike)
    handleLike = async () => {
      try {
        const likes = blog.likes + 1
        await blogService.update(blog.id, { likes })
        setBlogs(blogs.map(blogOrig => blogOrig.id === blog.id ? { ...blogOrig, likes } : blogOrig))
      }
      catch (e) { showAlert('error', e.response.data) }
    }

  const handleDelete = async () => {
    if (window.confirm(`Do you want to delete ${blog.title}?`)) {
      try {
        await blogService.remove(blog.id, user.token)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        showAlert('success', 'Blog deleted')
      }
      catch (e) { showAlert('error', e.response.data) }
    }
  }

  return (
    <li>
      {blog.title}, {blog.author} 
      <button onClick={() => setDisplayBlog(displayBlog ? '' : 'none')}>
        {displayBlog ? 'Expand' : 'Collapse'}
      </button> 
      <div className="blog-details" style={{display: displayBlog}}>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>{blog.likes} like{blog.likes === 1 || 's'} <button className="like" onClick={handleLike}>Like</button></div>
        <div>added by {blog.user.username}</div>
        {user.id !== blog.user.id || <div><button onClick={handleDelete}>Delete</button></div>}
      </div>
    </li>  
  )
}

export default Blog