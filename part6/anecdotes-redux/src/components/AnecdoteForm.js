import { useDispatch } from 'react-redux'
import { createNew } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {

    const dispatch = useDispatch()
    
    const addAnecdote = async (e) => {
        e.preventDefault()
        dispatch(createNew(e.target.anecdote.value))
        e.target.anecdote.value = ''
    }

    return (<>
        <h2>create new</h2>
        <form onSubmit={addAnecdote}>
            <div><input name="anecdote" /></div>
            <button>create</button>
        </form>
    </>)
}

export default AnecdoteForm