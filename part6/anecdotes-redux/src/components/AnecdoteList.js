import { useSelector, useDispatch } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'
import Filter from './Filter'

const AnecdoteList = () => {

    const anecdotes = useSelector(state => state.anecdotes
        .filter(item => item.content.includes(state.filter))
        .sort((a, b) => b.votes - a.votes))
    
    const dispatch = useDispatch()

    return (<>
        <h2>Anecdotes</h2>
        <Filter />
        {anecdotes.map(anecdote =>
            <div key={anecdote.id}>
                <div>{anecdote.content}</div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => dispatch(voteFor(anecdote))}>vote</button>
                </div>
            </div>
        )}
    </>)
}

export default AnecdoteList