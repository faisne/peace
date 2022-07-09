import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import login from './services/login'
import './App.css'

const Message = ({ message }) => {
  let messageStyle = {}
  switch (message.type) {
    case 'success': messageStyle = { color: '#333', background: '#DFD', marginTop: 16, padding: 4 }; break
    case 'error': messageStyle = { color: '#333', background: '#FDD', marginTop: 16, padding: 4 }; break
    default: return null
  }
  return (<div style={messageStyle}>{message.text}</div>)
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState('')
  const [loginDisabled, setLoginDisabled] = useState(false)

  const showAlert = (type, text) => {
    clearTimeout(message.timeID)
    setMessage({ type, text, timeID: setTimeout(() => setMessage(''), 3000) })
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user')
    if (loggedUserJSON)
      setUser(JSON.parse(loggedUserJSON))
  }, [])

  useEffect(() => {
    if (user)
      blogService.getAll().then(blogs => setBlogs(blogs))
    else
      setBlogs([])
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()
    await setLoginDisabled(true)
    try {
      const gotUser = await login({ username, password })
      window.localStorage.setItem('user', JSON.stringify(gotUser))
      setUser(gotUser)
      setUsername('')
      setPassword('')
      showAlert('success', 'Login successful')
    }
    catch(e) { showAlert('error', e.response.data) }
    finally { setLoginDisabled(false) }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('user')
    setUser(null)
    showAlert('success', 'Bye!')
  }

  
  const LoginForm = () => (
    <>
      <h2>Please log in</h2>
      <form onSubmit={handleLogin}>
        <fieldset disabled={loginDisabled}>
          <input type="text" placeholder="Username"
            value={username} onChange={({ target }) => setUsername(target.value)} />
          <input type="password" placeholder="Password"
            value={password} onChange={({ target }) => setPassword(target.value)} />
          <button type="submit">Log in</button>
        </fieldset>
      </form>
    </>
  )

  const BlogList = () => (
    <>
      <h2>Blogs</h2>
      <p>Current user: {user.username} <button onClick={handleLogout}>Log out</button></p>
      <BlogForm user={user} blogs={blogs} setBlogs={setBlogs} showAlert={showAlert} />
      <ul>
        {
          !blogs.length
            ? <li>loading...</li>
            : blogs.sort((a, b) => b.likes - a.likes)
              .map(blog => <Blog key={blog.id} pars={[user, blog, blogs, setBlogs, showAlert]} />)
        }
      </ul>
    </>
  )

  return (
    <div>
      <Message message={message} />
      {
        user
          ? BlogList()
          : LoginForm()
      }
    </div>
  )
}

export default App
