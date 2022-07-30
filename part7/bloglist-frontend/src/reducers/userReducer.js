import { createSlice } from '@reduxjs/toolkit'

import loginService from '../services/login'
import { showNotification } from './notificationReducer'

const userSlice = createSlice({
   name: 'user',
   initialState: null,
   reducers: {
      setUser(state, action) {
         if (!action.payload) window.localStorage.removeItem('user')
         return action.payload
      }
   }
})

export const initializeUser = () => async dispatch => {
   const loggedUserJSON = window.localStorage.getItem('user')
   if (loggedUserJSON) dispatch(setUser(JSON.parse(loggedUserJSON)))
}

export const login = ({ username, password }) => async dispatch => {
   try {
      const gotUser = await loginService({ username, password })
      dispatch(setUser(gotUser))
      window.localStorage.setItem('user', JSON.stringify(gotUser))
      dispatch(showNotification('success', 'Login successful'))
   }
   catch (e) { dispatch(showNotification('error', e.response.data)) }
}

export const { setUser } = userSlice.actions
export default userSlice.reducer