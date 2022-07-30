import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
   name: 'blogs',
   initialState: [],
   reducers: {
      setList(state, action) {
         return action.payload.sort((a, b) => b.likes - a.likes)
      },
      addItem(state, action) {
         return [...state, action.payload]
      },
      removeItem(state, action) {
         return state.filter(item => item.id !== action.payload)
      },
      likeItem(state, action) {
         return state
            .map(item =>
               item.id === action.payload
                  ? { ...item, likes: item.likes + 1 }
                  : item
            )
            .sort((a, b) => b.likes - a.likes)
      },
      addComment(state, action) {
         const { id, comment } = action.payload
         return state.map(item => item.id === id ? { ...item, comments: [...item.comments, comment] } : item)
      }
   },
})

export const initializeBlogs = () => async dispatch => {
   const blogs = await blogService.getAll()
   dispatch(setList(blogs))
}

export const createBlog = (object, user) => async dispatch => {
   const newBlog = await blogService.create(object, user.token)
   newBlog.user = { id: user.id, username: user.username }
   dispatch(addItem(newBlog))
}

export const removeBlog = (id, token) => async dispatch => {
   await blogService.remove(id, token)
   dispatch(removeItem(id))
}

export const likeBlog = (blog) => async dispatch => {
   const likes = blog.likes + 1
   await blogService.update(blog.id, { likes })
   dispatch(likeItem(blog.id))
}

export const newComment = (id, text, token) => async dispatch => {
   const comment = await blogService.addComment(id, text, token)
   dispatch(addComment({id, comment}))
}

export const { setList, addItem, removeItem, likeItem, addComment } = blogSlice.actions
export default blogSlice.reducer