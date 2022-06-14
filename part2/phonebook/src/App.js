import { useState, useEffect } from 'react'
import pbService from './services/persons.js'

const Input = ({label, value, onChange}) => <div>{label}: <input value={value} onChange={event => onChange(event.target.value)} /></div>

const Form = (props) => (
  <form onSubmit={props.handleSubmit}>
    <Input label="name" value={props.newName} onChange={props.setNewName} />
    <Input label="number" value={props.newNumber} onChange={props.setNewNumber} />
    <div><button type="submit">add</button></div>
  </form>
)

const Persons = ({search, setSearch, persons, setPersons, setMessage}) => {
  const removePerson = (id, name) => {
    if(window.confirm(`Do you want to delete ${name}?`)) {
      pbService.remove(id).then( setPersons(persons.filter(person => person.id !== id)) )
      setMessage({type: 'success', text: 'Person deleted'})
      setTimeout(() => setMessage(''), 3000)
    }
  }
  
  return (
    <>
      <Input label="search" value={search} onChange={setSearch} />
      {persons.filter(person => search === '' ? true : person.name.toLowerCase().includes(search.toLowerCase()))
        .map(person => <p key={person.id}>{person.name} {person.number} <button onClick={() => removePerson(person.id, person.name)}>Delete</button></p>)}
    </>
  )
}

const Message = ({message}) => {
  let messageStyle = {}
  switch(message.type) {
    case 'success': messageStyle = { color: '#333', background: '#DFD', marginTop: 16, padding: 4 }; break
    case 'error': messageStyle = { color: '#333', background: '#FDD', marginTop: 16, padding: 4 }; break
    default: return null
  }
  return (<div style={messageStyle}>{message.text}</div>)
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState({type:'', text:''})
  
  useEffect(() => { pbService.getAll().then(initialData => {setPersons(initialData)}) }, [])

  const handleSubmit = event => {
    event.preventDefault()
    const found = persons.find(person => person.name === newName)
    if(found) {
      pbService.get(found.id)
        .then(result => {
          if (!result) {
            setMessage({ type: 'error', text: 'The person has already been deleted' })
            setTimeout(() => setMessage({}), 3000)
            setPersons(persons.filter(person => person.id !== found.id))
          }
          else if (window.confirm(`${found.name} is already in the book. Update the number?`)) {
            pbService
              .update(found.id, { ...found, number: newNumber })
              .then(returnedPerson => {
                setPersons(persons.map(person => person.id !== found.id ? person : returnedPerson))
                setNewName('')
                setNewNumber('')
                setMessage({ type: 'success', text: 'Information updated' })
                setTimeout(() => setMessage({}), 3000)
              })
              .catch(error => {
                console.log(error);
                setMessage({ type: 'error', text: error.response.data.error })
                setTimeout(() => setMessage({}), 3000)
              })
          }
        })
    }
    else {
      const newPerson = {name: newName, number: newNumber}
      pbService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage({type: 'success', text: 'A new person added'})
          setTimeout(() => setMessage({}), 3000)
        }) 
        .catch(error => {
          setMessage({ type: 'error', text: error.response.data.error })
          setTimeout(() => setMessage({}), 3000)
        } )
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Form newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} handleSubmit={handleSubmit} />
      <Message message={message} />
      
      <h2>Numbers</h2>
      <Persons search={search} setSearch={setSearch} persons={persons} setPersons={setPersons} setMessage={setMessage} />
      
    </div>
  )
}

export default App