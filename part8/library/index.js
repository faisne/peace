const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')
const mongoose = require('mongoose')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const { MONGODB_URI, JWT_SECRET, PASSWORD } = process.env

mongoose
   .connect(MONGODB_URI)
   .then(() => {
      console.log('connected to MongoDB')
   })
   .catch(error => {
      console.log('error connection to MongoDB:', error.message)
   })

const typeDefs = gql`
   type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(author: String, genre: String): [Book!]!
      allAuthors: [Author!]!
      me: User
   }

   type Mutation {
      addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book
      editAuthor(name: String!, setBorn: Int!): Author
      createUser(username: String!, favouriteGenre: String!): User
      login(username: String!, password: String!): Token
   }

   type Author {
      id: ID!
      name: String!
      born: Int
      bookCount: Int!
   }

   type Book {
      title: String!
      author: Author!
      published: Int!
      genres: [String!]!
      id: ID!
   }

   type User {
      username: String!
      favouriteGenre: String!
      id: ID!
   }

   type Token {
      value: String!
   }
`

const resolvers = {
   Query: {
      bookCount: async () => Book.countDocuments(),
      authorCount: async () => Author.countDocuments(),
      allBooks: async (root, args) => {
         const pars = {}
         if (args.author) {
            const author = await Author.findOne({ name: args.author })
            pars.author = author._id.toString()
         }
         if (args.genre) {
            pars.genres = { $in: [args.genre] }
         }
         return Book.find(pars).populate('author')
      },
      allAuthors: async () => Author.find({}),
      me: (root, args, context) => context.currentUser,
   },
   Author: {
      bookCount: async root => Book.countDocuments({ author: root._id.toString() }),
   },
   Mutation: {
      addBook: async (root, args, context) => {
         if (!context.currentUser) {
            throw new AuthenticationError('not authenticated')
         }

         let author = await Author.findOne({ name: args.author })
         if (!author) {
            author = new Author({ name: args.author })
            await author.save()
         }
         const book = new Book({ ...args, author })
         try {
            await book.save()
         } catch (e) {
            throw new UserInputError(e.message, { invalidArgs: args })
         }
         return book
      },
      editAuthor: async (root, args, context) => {
         if (!context.currentUser) {
            throw new AuthenticationError('not authenticated')
         }
         
         const author = await Author.findOne({ name: args.name })
         if (!author) throw new UserInputError('No such author', { invalidArgs: args })

         author.born = args.setBorn
         try {
            await author.save()
         } catch (e) {
            throw new UserInputError(e.message, { invalidArgs: args })
         }
         return author
      },
      createUser: async (root, args) => {
         const user = new User({ ...args })
         await user.save()
         return user
      },
      login: async (root, args) => {
         const user = await User.findOne({ username: args.username })
         if (!user || args.password !== PASSWORD) throw new UserInputError('wrong credentials')
         const userForToken = {
            username: user.username,
            id: user._id,
         }
         return { value: jwt.sign(userForToken, JWT_SECRET) }
      },
   },
}

const server = new ApolloServer({
   typeDefs,
   resolvers,
   context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
         const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
         const currentUser = await User.findById(decodedToken.id)
         return { currentUser }
      }
   },
})

server.listen().then(({ url }) => {
   console.log(`Server ready at ${url}`)
})
