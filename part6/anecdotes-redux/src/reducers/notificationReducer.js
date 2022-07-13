import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        show(state, action) { return action.payload },
        clear(state, action) { return '' }
    }
})

export const showNotification = (text, time) =>
    dispatch => {
        dispatch(show(text))
        setTimeout(() => dispatch(clear()), time * 1000)
    }

export const { show, clear } = notificationSlice.actions
export default notificationSlice.reducer