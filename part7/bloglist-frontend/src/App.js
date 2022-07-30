import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Button, TextField, Snackbar, Alert,
   Container, Box, Typography, Stack, Paper, 
   Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'
import { styled } from '@mui/material/styles'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import { showNotification, clear } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser, initializeUser, login } from './reducers/userReducer'
import { initializeUsers } from './reducers/userListReducer'


const Item = styled(Paper)(({ theme }) => ({
   backgroundColor: theme.palette.secondary.main,
   ...theme.typography.body1,
   padding: theme.spacing(1),
   color: theme.palette.secondary.contrastText,
}))

const Message = () => {
   const dispatch = useDispatch()
   const message = useSelector(state => state.notification)
   return (
      <Snackbar
         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
         open={message ? true : false}
         onClose={() => dispatch(clear())}
         autoHideDuration={5000}
      >
         <Alert severity={message.type}>{message.text}</Alert>
      </Snackbar>
   )
}

const Users = ({ users }) => (
   <div>
      <Typography variant='h4'>Users</Typography>
      <Table>
         <TableHead>
            <TableRow>
               <TableCell>user</TableCell>
               <TableCell>blogs created</TableCell>
            </TableRow>
         </TableHead>
         <TableBody>
            {users ? (
               users.map(user => (
                  <TableRow key={user.id}>
                     <TableCell><Link to={`/users/${user.id}`}>{user.username}</Link></TableCell>
                     <TableCell>{user.blogs.length}</TableCell>
                  </TableRow>
               ))
            ) : (
               <TableRow>
                  <TableCell>loading...</TableCell>
               </TableRow>
            )}
         </TableBody>
      </Table>
   </div>
)

const User = ({ user }) => (
   <>
      <Typography variant='h4' gutterBottom>{user.username}</Typography>
      <Typography variant='h5' gutterBottom>Added blogs:</Typography>
      { user.blogs.length
         ? <Stack spacing={1}>{user.blogs.map(blog => <Item key={blog.id}>{blog.title}</Item>)}</Stack> 
         : <Typography variant='body1' color='text.secondary'>No blogs added</Typography>
      }
   </>
)

const App = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [loginDisabled, setLoginDisabled] = useState(false)
   const user = useSelector(state => state.user)
   const blogs = useSelector(state => state.blogs)
   const users = useSelector(state => state.userlist)

   useEffect(() => { dispatch(initializeUser()) }, [dispatch])
   useEffect(() => { if (user) dispatch(initializeBlogs()) }, [dispatch, user])
   useEffect(() => { dispatch(initializeUsers()) }, [dispatch])

   const userMatch = useMatch('/users/:id')
   const userView = userMatch && users
      ? users.find(item => item.id === userMatch.params.id)
      : null

   const blogMatch = useMatch('/blogs/:id')
   const blogView =
      blogMatch && blogs
         ? blogs.find(item => item.id === blogMatch.params.id)
         : null
   
   const handleLogin = event => {
      event.preventDefault()
      setLoginDisabled(true)
      dispatch(login({ username, password }))
      setLoginDisabled(false)
   } 

   const handleLogout = () => {
      navigate('/')
      setUsername('')
      setPassword('')
      dispatch(setUser(null))
      dispatch(showNotification('success', 'Bye!'))
   }

   const Navbar = () => (
      <AppBar>
         <Toolbar variant="dense">
            <Box sx={{flexGrow: 1}}>
               <Button color='inherit' sx={{mr: 1}} onClick={() => navigate('/')}>Blogs</Button>
               <Button color='inherit' onClick={() => navigate('/users')}>Users</Button>
            </Box>
            <Typography variant='body1' mr={2}>{user.username}</Typography>
            <Button color='inherit' variant='outlined' size='small' onClick={handleLogout}>Log out</Button>
         </Toolbar>
      </AppBar>
   )

   const LoginForm = () => (
      <Container maxWidth="xs">
         <Toolbar />
         <form onSubmit={handleLogin}>
            <fieldset disabled={loginDisabled}>
               <Stack spacing={2} m={1}>
                  <Typography variant="h5" textAlign="center">Please log in</Typography>
                  <TextField label="Username" size="small" value={username}
                     onChange={({ target }) => setUsername(target.value)} />
                  <TextField type="password" label="Password" size="small" value={password}
                     onChange={({ target }) => setPassword(target.value)} />
                  <Button type="submit" variant='contained'>Log in</Button>
               </Stack>
            </fieldset>
         </form>
      </Container>
   )

   const BlogList = () => (
      <>
         <Typography variant='h4' gutterBottom>Blogs</Typography>
         <BlogForm />
         {!blogs.length 
            ? <Typography variant='body1' color='text.secondary'>Loading...</Typography> 
            : <Stack spacing={1}>{blogs.map(blog => (
               <Item key={blog.id} sx={{cursor: 'pointer'}} onClick={() => navigate(`/blogs/${blog.id}`)}>
                  {blog.title}, {blog.author}
               </Item>
            ))}</Stack>
         }
      </>
   )

   return (
      <>
         {!user || Navbar()}
         {!user || <Toolbar />}
         <Message />
         <Routes>
            <Route path="/" element={user ? BlogList() : LoginForm()} />
            <Route path="/users" element={<Users users={users} />} />
            <Route path='/users/:id' element={!userView || <User user={userView} />} />
            <Route path='/blogs/:id' element={!blogView || <Blog blog={blogView} Item={Item} />} />
         </Routes>
      </>
   )
}

export default App
