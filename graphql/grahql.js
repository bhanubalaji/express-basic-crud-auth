
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Define a schema
const schema = buildSchema(`
  type Query {
    hello: String
    user(id: Int!): User
  }

  type User {
    id: Int
    name: String
    email: String
  }
`);

// Sample data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
];

// Root resolver
const root = {
  hello: () => 'Hello, world!',
  user: ({ id }) => users.find(user => user.id === id),
};

// Create an Express app
const app = express();

// Use GraphQL HTTP middleware
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enable GraphiQL interface
}));

// Start the server
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql');
});
