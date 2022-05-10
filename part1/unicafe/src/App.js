import { useState } from 'react'

const Heading = ({text}) => <h1>{text}</h1>
const Button = ({type, handleClick}) => <button onClick={handleClick}>{type}</button>
const StatisticLine = ({type, number}) => <tr><td>{type}</td><td>{number}</td></tr>
const Statistics = ({good, neutral, bad}) => {
  if(!good && !neutral && !bad) return <p>No feedback given</p>
  return (
    <table>
      <tbody>
        <StatisticLine type="good" number={good} />
        <StatisticLine type="neutral" number={neutral} />
        <StatisticLine type="bad" number={bad} />
        <StatisticLine type="total" number={good + neutral + bad} />
        <StatisticLine type="average" number={(good - bad)/(good + neutral + bad)} />
        <StatisticLine type="positive" number={100*good/(good+neutral+bad) + " %"} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Heading text="give feedback" />
      <Button type="good" handleClick={()=>setGood(good+1)} />
      <Button type="neutral" handleClick={()=>setNeutral(neutral+1)} />
      <Button type="bad" handleClick={()=>setBad(bad+1)} />

      <Heading text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App