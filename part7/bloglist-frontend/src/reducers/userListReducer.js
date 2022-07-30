import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const userListSlice = createSlice({
   name: 'userList',
   initialState: null,
   reducers: {
      setList(state, action) {
         return action.payload
      },
   },
})

export const initializeUsers = () => async dispatch => {
   const blogs = await userService.getAll()
   dispatch(setList(blogs))
}

export const { setList } = userListSlice.actions
export default userListSlice.reducer