import { useState } from 'react'

const Button = ({text, handleClick}) => <button onClick={handleClick}>{text}</button>
const Anecdote = ({title, anecdote, votes}) =>
  <>
    <h1>{title}</h1>
    <p>{anecdote}</p>
    <p>has {votes} votes</p>
  </>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
  
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [maxVoted, setMaxVoted] = useState(0)

  const randomAnecdote = () => setSelected(Math.floor(Math.random() * (anecdotes.length)))
  const vote = () => {
    const votes_copy = [...votes]
    votes_copy[selected] += 1
    setVotes(votes_copy)
    if(votes_copy[selected] > votes_copy[maxVoted]) setMaxVoted(selected)
  }

  return (
    <>
      <Anecdote title="Random anecdote" anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button text="Vote" handleClick={vote} />
      <Button text="Another one" handleClick={randomAnecdote} />
      <Anecdote title="Most voted anecdote" anecdote={anecdotes[maxVoted]} votes={votes[maxVoted]} />
    </>
  )
}

export default App