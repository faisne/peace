import { connect } from 'react-redux'
import { createNew } from '../reducers/anecdoteReducer'

const AnecdoteForm = ({ createNew }) => {
    
    const addAnecdote = async (e) => {
        e.preventDefault()
        createNew(e.target.anecdote.value)
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

const ConnectedAnecdoteForm = connect(null, { createNew })(AnecdoteForm)
export default ConnectedAnecdoteForm