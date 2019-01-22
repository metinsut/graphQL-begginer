const { ApolloServer, gql, PubSub } = require('apollo-server');

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
   type Subscription {
      newUser: User!
   }
`;

const NEW_USER = "NEW_USER";

const resolvers = {
   Subscription: {
      newUser: {
         subscribe: (_, __, { pubSub }) => pubSub.asyncIterator(NEW_USER)
      }
   },
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
      register: (_, { username }, { pubSub }) => {
         const user = {
            id: 1,
            username
         }
         pubSub.publish(NEW_USER, {
            newUser: user
         });
         return {
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
            user
         }
      }
   }
};

const pubSub = new PubSub();

const server = new ApolloServer({
   typeDefs,
   resolvers,
   context: ({ req, res }) => ({ req, res, pubSub })
});

server.listen().then(({ url }) => {
   console.log(`🚀 Server ready at ${url}`);
});
