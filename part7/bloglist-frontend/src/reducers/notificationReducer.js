import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
   name: 'notification',
   initialState: '',
   reducers: {
      show(state, action) {
         return action.payload
      },
      clear(state, action) {
         return ''
      },
   },
})

export const showNotification = (type, text) => dispatch => {
   dispatch(
      show({ type, text })
   )
}

export const { show, clear } = notificationSlice.actions
export default notificationSlice.reducer
