const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
   type Query {
      message(name: String): String
      user: User!
   }
   type User {
      id: ID!
      username: String!
      firstLetterOfUserName: String!
   }
   type Error {
      field: String!
      message: String!
   }
   type RegisterResponse {
      errors: [Error!]!
      user: User!
   }
   input UserInfo {
      username: String!
      password: String!
      age: Int
   }
   type Mutation {
      register(userInfo: UserInfo!): RegisterResponse!
      login(userInfo: UserInfo!): String!
   }
`;

const resolvers = {
   User: {
      firstLetterOfUserName: parent => {
         return parent.username[0];
      },
      username: parent => {
         return parent.username;
      }
   },
   Query: {
      message: (parent, { name }) => {
         return `Heyy ${name}`;
      },
      user: () => ({
         id: 2,
         username: 'Fırat'
      })
   },
   Mutation: {
      login: (parent, { userInfo: { username } }, context) => {
         return username;
      },
      register: () => ({
         errors: [
            {
               field: 'username',
               message: 'bad'
            },
            {
               field: 'username2',
               message: 'bad2'
            }
         ],
         user: {
            id: 1,
            username: 'John'
         }
      })
   }
};

const server = new ApolloServer({
   typeDefs,
   resolvers,
   context: ({ req, res }) => ({ req, res })
});

server.listen().then(({ url }) => {
   console.log(`🚀 Server ready at ${url}`);
});
