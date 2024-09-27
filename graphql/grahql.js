const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const graphqlserver = (app) => {
  // Define a schema
  const schema = buildSchema(`
    type Query {
      hello: String
      user(id: Int!): User
      users: [User]
    }

    type Mutation {
      createUser(name: String!, email: String!): User
      updateUser(id: Int!, name: String, email: String): User
      deleteUser(id: Int!): String
    }

    type User {
      id: Int
      name: String
      email: String
    }
  `);

  // Sample data
  let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
  ];

  // Root resolver
  const root = {
    hello: () => 'Hello, world!',
    user: ({ id }) => users.find(user => user.id === id),
    users: () => users,

    createUser: ({ name, email }) => {
      const newUser = {
        id: users.length + 1,
        name,
        email,
      };
      users.push(newUser);
      return newUser;
    },

    updateUser: ({ id, name, email }) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) return "User not found";

      if (name) users[userIndex].name = name;
      if (email) users[userIndex].email = email;
      return users[userIndex];
    },

    deleteUser: ({ id }) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) return "User not found";

      users.splice(userIndex, 1);
      return "User deleted successfully";
    },
  };

  // Use GraphQL HTTP middleware
  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL interface
  }));
}

module.exports = { graphqlserver };
