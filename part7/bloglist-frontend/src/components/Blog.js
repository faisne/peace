import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, TextField, Typography, Stack, Grid, Paper } from '@mui/material'

import { showNotification } from "../reducers/notificationReducer"
import { removeBlog, likeBlog, newComment } from "../reducers/blogReducer"


const Blog = ({blog, Item, handleLike}) => {
  const user = useSelector(state => state.user)
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
   
  if (!handleLike)
    handleLike = async () => {
      try { dispatch(likeBlog(blog)) }
      catch (e) { dispatch(showNotification('error', e.response.data)) }
    }

  const handleDelete = async () => {
    if (window.confirm(`Do you want to delete ${blog.title}?`)) {
      try {
        dispatch(removeBlog(blog.id, user.token))
        navigate('/')
        dispatch(showNotification('success', 'Blog deleted'))
      }
      catch (e) { dispatch(showNotification('error', e.response.data)) }
    }
  }

  const handleAddComment = async event => {
    event.preventDefault()
    dispatch(newComment(blog.id, comment, user.token))
    setComment('')
  }

  return (
    <>
      <Typography variant='h4' gutterBottom>{blog.title}</Typography>
      <Grid container spacing={1}>
        <Grid item xs='auto' sx={{}}>
          <Paper sx={{height: 80, padding: 1, justifyContent: 'center'}}>
            <Typography variant='body1'>{blog.likes} like{blog.likes === 1 || 's'}</Typography>
            <Button size="small" variant='outlined' onClick={handleLike}>Like</Button>
          </Paper>
        </Grid>
        <Grid item xs="auto">
          <Paper sx={{height: 80, padding: 1}}>
            <Stack spacing={0.5}>
              <Typography variant='body1'><a href={blog.url}>{blog.url}</a></Typography>
              <Typography variant='body1'>Author: {blog.author}</Typography>
              <Typography variant='body1'>Added by: {blog.user.username}</Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      {user.id !== blog.user.id || <div><Button variant='outlined' color='error' sx={{marginTop: 1}} onClick={handleDelete}>Delete</Button></div>}
      <Typography variant='h5' mt={3} gutterBottom>Comments:</Typography>
      <form style={{marginBottom: 16}} onSubmit={handleAddComment}>
        <TextField size='small' value={comment} onChange={({target}) => setComment(target.value)} />
        <Button type='submit'>Add comment</Button>
      </form>
      { blog.comments.length
         ? <Stack spacing={1}>{blog.comments.map(comment => <Item key={comment.id}>{comment.text}</Item>)}</Stack> 
         : <Typography variant='body1' color='text.secondary'>No comments</Typography>
      }
    </>
  )
}

export default Blog