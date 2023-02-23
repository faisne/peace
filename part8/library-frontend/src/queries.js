import { gql } from '@apollo/client'

export const ME = gql`
   query {
      me {
         username
         favouriteGenre
      }
   }`

export const LOGIN = gql`
   mutation login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
         value
      }
   }
`

export const ALL_AUTHORS = gql`
   query {
      allAuthors {
         name
         born
         bookCount
      }
   }
`
export const ALL_BOOKS = gql`
   query {
      allBooks {
         title
         author { name }
         published
         genres
      }
   }
`
export const CREATE_BOOK = gql`
   mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
      addBook(title: $title, author: $author, published: $published, genres: $genres) {
         title
         author { name }
         published
      }
   }
`
export const EDIT_AUTHOR = gql`
   mutation editAuthorBirth($name: String!, $year: Int!) {
      editAuthor(name: $name, setBorn: $year) {
         name
         born
         bookCount
      }
   }
`