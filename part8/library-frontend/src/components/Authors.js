import { useQuery, useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = props => {
   const result = useQuery(ALL_AUTHORS)
   const [name, setName] = useState('')
   const [year, setYear] = useState('')
   const [editAuthor] = useMutation(EDIT_AUTHOR, {
      refetchQueries: [{ query: ALL_AUTHORS }],
   })

   if (!props.show)
      return null

   if (result.loading)
      return <div>loading...</div>

   const authors = [...result.data.allAuthors]

   const submitAuthor = event => {
      event.preventDefault()
      editAuthor({ variables: { name, year } })
      setName('')
      setYear('')
   }

   return (
      <div>
         <h2>authors</h2>
         <table>
            <tbody>
               <tr>
                  <th></th>
                  <th>born</th>
                  <th>books</th>
               </tr>
               {authors.map(a => (
                  <tr key={a.name}>
                     <td>{a.name}</td>
                     <td>{a.born}</td>
                     <td>{a.bookCount}</td>
                  </tr>
               ))}
            </tbody>
         </table>
         <h3>Set an author's birth year</h3>
         <form onSubmit={submitAuthor}>
            <select value={name} onChange={({target}) => setName(target.value)}>
               <option value="">-- Select an author --</option>
               {authors.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
            </select>
            <div>born: <input type="number" size={10} value={year} onChange={({target}) => setYear(Number(target.value))} /></div>
            <div><button>Save</button></div>
         </form>
      </div>
   )
}

export default Authors
