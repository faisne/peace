import { useState, useEffect } from "react"
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const Login = ({show, setToken, setPage}) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [ login, result ] = useMutation(LOGIN, {
        onError: (error) => { console.log(error.graphQLErrors[0].message) }
    })

    useEffect(() => {    
        if ( result.data ) {      
            const token = result.data.login.value      
            setToken(token)      
            localStorage.setItem('library-user-token', token)
            setPage('authors')
        }
    }, [result.data]) // eslint-disable-line
    
    const submit = (event) => {
        event.preventDefault()
        login({ variables: { username, password } })
    }

    if (!show)
        return null

    return (
        <div>
            <h2>Log in</h2>
            <form onSubmit={submit}>
                username <input value={username} onChange={({ target }) => setUsername(target.value)} /><br />
                password <input type='password' value={password} onChange={({ target }) => setPassword(target.value)} /><br />
                <button>log in</button>
            </form>
        </div>
    )
}

export default Login