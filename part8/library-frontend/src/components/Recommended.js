import { useQuery } from '@apollo/client/react'
import { ME } from '../queries'
import { ALL_BOOKS } from '../queries'

const Recommended = props => {
    const resultMe = useQuery(ME)
    const resultBooks = useQuery(ALL_BOOKS)

    if (!props.show)
        return null

    if (resultMe.loading || resultBooks.loading)
        return <div>loading...</div>
   
    const me = {...resultMe.data.me}
    console.log(resultMe.data)

    return (
        <div>
            <h1>Recommended for {me.username}</h1>
            <h3>Genre &mdash; {me.favouriteGenre}</h3>
            <table>
                <thead>
                    <tr>
                        <th>title</th>
                        <th>author</th>
                        <th>published</th>
                        <th>genres</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        resultBooks.data.allBooks
                            .filter(b => b.genres.map(g => g.toLowerCase()).includes(me.favouriteGenre.toLowerCase()))
                            .map(b => (
                                <tr key={b.title}>
                                    <td>{b.title}</td>
                                    <td>{b.author.name}</td>
                                    <td>{b.published}</td>
                                    <td>{b.genres.join(', ')}</td>
                                </tr>
                            ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Recommended