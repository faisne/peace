import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { initializeList } from './reducers/anecdoteReducer'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'

const App = () => {
  
  const dispatch = useDispatch()
  useEffect(() => { dispatch(initializeList()) }, [dispatch])

  return (
    <>
      <Notification />
      <AnecdoteList />
      <AnecdoteForm />
    </>
  )
}

export default App