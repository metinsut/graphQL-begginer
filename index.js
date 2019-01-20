const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
   type Query {
      message: String
      user: User!
   }
   type User {
      id: ID!
      username: String!
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
      login(userInfo: UserInfo!): Boolean!
   }
`;

const resolvers = {
   Query: {
      message: () => null,
      user: () => ({
         id: 2,
         username: 'Fırat'
      })
   },
   Mutation: {
      login: () => true,
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
   resolvers
});

server.listen().then(({ url }) => {
   console.log(`🚀 Server ready at ${url}`);
});
