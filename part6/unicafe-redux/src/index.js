import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import counterReducer from './reducers/counterReducer'

const store = createStore(counterReducer)

const Heading = ({ text }) => <h1>{text}</h1>
const Button = ({ type, handleClick }) => <button onClick={handleClick}>{type}</button>
const StatisticLine = ({ type, number }) => <tr><td>{type}</td><td>{number}</td></tr>
const Statistics = ({ good, neutral, bad }) => {
    if (!good && !neutral && !bad) return <p>No feedback given</p>
    return (
        <table>
            <tbody>
                <StatisticLine type="good" number={good} />
                <StatisticLine type="neutral" number={neutral} />
                <StatisticLine type="bad" number={bad} />
                <StatisticLine type="total" number={good + neutral + bad} />
                <StatisticLine type="average" number={(good - bad) / (good + neutral + bad)} />
                <StatisticLine type="positive" number={100 * good / (good + neutral + bad) + " %"} />
            </tbody>
        </table>
    )
}

const App = () => {
    // save clicks of each button to its own state
    // const [good, setGood] = useState(0)
    // const [neutral, setNeutral] = useState(0)
    // const [bad, setBad] = useState(0)

    return (
        <div>
            <Heading text="give feedback" />
            <Button type="good" handleClick={() => store.dispatch({type: 'GOOD'})} />
            <Button type="neutral" handleClick={() => store.dispatch({ type: 'OK' })} />
            <Button type="bad" handleClick={() => store.dispatch({ type: 'BAD' })} />

            <Heading text="statistics" />
            <Statistics good={store.getState().good} neutral={store.getState().ok} bad={store.getState().bad} />
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
const renderApp = () => root.render(<App />)
renderApp()
store.subscribe(renderApp)
