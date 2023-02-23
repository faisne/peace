import { useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = props => {
   const result = useQuery(ALL_BOOKS)
   const [genre, setGenre] = useState('')

   if (!props.show)
      return null

   if (result.loading)
      return <div>loading...</div>
   
   const books = [...result.data.allBooks]
   const genres_ = books.flatMap(b => b.genres).map(b => b.toLowerCase())
   const genres = Array.from(new Set(genres_))

   return (
      <div>
         <h2>books</h2>

         <select value={genre} onChange={({target}) => setGenre(target.value)}>
            <option value=''>Choose genre</option>
            {genres.map(g => (
               <option key={g} value={g}>{g}</option>
            ))}
         </select>

         <table>
            <tbody>
               <tr>
                  <th></th>
                  <th>author</th>
                  <th>published</th>
                  <th>genres</th>
               </tr>
               {books.filter(b => genre === '' ? b:  b.genres.map(b => b.toLowerCase()).includes(genre)).map(a => (
                  <tr key={a.title}>
                     <td>{a.title}</td>
                     <td>{a.author.name}</td>
                     <td>{a.published}</td>
                     <td>{a.genres.join(', ')}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   )
}

export default Books
