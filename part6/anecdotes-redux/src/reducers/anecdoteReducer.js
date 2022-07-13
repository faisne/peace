import anecdoteService from '../services/anecdotes'
import { showNotification } from './notificationReducer'


export const fill = (data) => {
  return { type: 'FILL', data }
}

export const add = (data) => {
  return { type: 'ADD', data }
}

export const vote = (id) => {
  return { type: 'VOTE', data: { id } }
}

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE': return state.map(it => it.id === action.data.id ? {...it, votes: it.votes + 1 } : it)
    case 'ADD': return [...state, action.data]
    case 'FILL': return action.data
    default: return state
  }
}

export const initializeList = () => 
  async dispatch => {
    const data = await anecdoteService.getAll()
    dispatch(fill(data))
  }

export const createNew = (content) =>
  async dispatch => {
    const newOne = await anecdoteService.addNew(content)
    dispatch(add(newOne))
    dispatch(showNotification(`you added "${newOne.content}"`, 5))
  }

export const voteFor = (anecdote) => 
  async dispatch => {
    await anecdoteService.update(anecdote.id, { ...anecdote, votes: anecdote.votes + 1 })
    dispatch(vote(anecdote.id))
    dispatch(showNotification(`you voted for "${anecdote.content}"`, 5))
  }

export default reducer