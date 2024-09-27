
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const graphqlserver = (app) => {
  const DetailsModel = require('../models/graphql');

  // Define a schema
  const schema = buildSchema(`
    type Query {
      hello: String
      user(_id: String!): ResponseObject
      users: ResponseArrayObject
    }

    type Mutation {
      createUser(name: String!, email: String!): ResponseObject
      updateUser(_id: String!, name: String, email: String): ResponseObject
      deleteUser(_id: String!): ResponseObject
    }
        type ResponseArrayObject {
    status: Int
    success: Boolean
    message: String
    data: [UserDataOject]
  }
  type ResponseObject {
    status: Int
    success: Boolean
    message: String
    data: UserDataOject
  }
    type UserDataOject {
      _id:String  
      name: String
      email: String
    }
  `);

  // Sample data
  // let users = [
  //   { _id: 1, name: 'John Doe', email: 'john@example.com' },
  //   { _id: 2, name: 'Jane Doe', email: 'jane@example.com' },
  // ];

  // Root resolver
  const root = {
    hello: () => 'Hello, world!',
    // user: async ({ _id }) => await DetailsModel.find(user => user._id === _id),
    user: async ({ _id }) => {
      try {
        console.log('data, _id', _id)
        const items = await DetailsModel.findById(_id);
        console.log(items)
        return {
          status: 200,
          success: true,
          message: "items fetched successfully",
          data: items
        };
      } catch (error) {
        return {
          status: 500,
          success: false,
          message: "Internal server error",
        };
      }
    },
    users: async () => {
      try {
        console.log('data')
        const items = await DetailsModel.find();
        console.log(items)
        return {
          status: 200,
          success: true,
          message: "items fetched successfully",
          data: items
        };
      } catch (error) {
        return {
          status: 500,
          success: false,
          message: "Internal server error",
        };
      }
    },

    createUser: async ({ name, email }) => {
      try {
        const userName = await DetailsModel.findOne({ name: name })
        if (userName) {
          return {
            status: 400,
            success: false,
            message: "Details already exists",
            data: null
          };
        }
        const Details = new DetailsModel({
          name: name,
          email: email,
        })
        await Details.save();
        return {
          status: 200,
          success: true,
          message: "User created successfully",
          data: Details
        }
      } catch (error) {
        console.log(error)
      }

      // const newUser = {
      //   id: users.length + 1,
      //   name,
      //   email,
      // };
      // users.push(newUser);
      // return newUser;
    },

    updateUser: async ({ _id, name, email }) => {
      try {
        const userName = await DetailsModel.findOne({ name: name })
        if (userName) {
          return {
            status: 400,
            success: false,
            message: "item with this name already exists",
            data: null
          };
        }
        const itemData = await DetailsModel.findById(_id);
        if (!itemData) {
          return {
            status: 404,
            success: false,
            message: "items not found",
            data: null
          };
        }
        const items = await DetailsModel.findByIdAndUpdate(
          _id,
          { name, email },
          { new: true, runValidators: true } // `runValidators` option ensures validation is applied
        );

        return {
          status: 200,
          success: true,
          message: "items updated successfully",
          data: items
        };
      }
      catch (error) {
        if (error.name === 'ValidationError') {
          const errorMessages = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({
            status: 400,
            success: false,
            message: 'Validation Error',
            errors: errorMessages,
          });
        } else {
          console.error('error', error);
          return res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal server error',
          });
        };
      }

      // const userIndex = users.findIndex(user => user.id === id);
      // if (userIndex === -1) return "User not found";

      // if (name) users[userIndex].name = name;
      // if (email) users[userIndex].email = email;
      // return users[userIndex];

    },

    deleteUser: async ({ _id }) => {
      console.log(_id)
      try {
        const itemOne = await DetailsModel.findById(_id);
        if (!itemOne) {
          return {
            status: 404,
            success: false,
            message: "items not found",
          };
        }

        const items = await DetailsModel.findByIdAndDelete(_id);
        console.log('items', items, _id)
        return {
          status: 200,
          success: true,
          message: "items deleted successfully",
          data: items
        };
      }
      catch (error) {
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Internal server error",
        });
      }


      // const userIndex = users.findIndex(user => user._id === _id);
      // if (userIndex === -1) return "User not found";

      // users.splice(userIndex, 1);
      // return "User deleted successfully";
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
