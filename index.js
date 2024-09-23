const express = require('express');
const router = require('./routers/CRUDRouters');
const userAuthrouter = require('./routers/userAuthRoutes');
const logger = require('./logger');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: __dirname + '/config/.env' }); // Load .env file contents into process.env
require("./config/db")


//middlewares
app.use(express.json()) // For parsing application/json
app.use(cookieParser());
app.use(bodyParser.json());


app.use(userAuthrouter)
app.use(router);

app.get('/api/error', (req, res) => {
  // Intentionally throw an error
  const error = new Error('This is a simulated error!');
  logger.error(error.message); // Log the error message
  res.status(500).json({ success: false, message: error.message });
});


app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});




 // ------------practice sample error handles---------------------

  // app.use((err, req, res, next) => {
  //   console.error(err.stack);
  //   res.status(500).send('Something broke!');
  // });






//------------sample crud routes practice------------------------


// let items = [];

// // Get all items
// app.get('/api/items', (req, res) => {
//   res.json(items);
// });

// // Create a new item
// app.post('/api/items', (req, res) => {
//   const newItem = req.body;
//   items.push(newItem);
//   console.log(items)
//   res.status(201).json(newItem);
// });

// // Update an item
// app.put('/api/items/:id', (req, res) => {
//   const id = parseInt(req.params.id, 10);
//   const updatedItem = req.body;
//   let item = items.find(i => i.id === id);
//   if (item) {
//     Object.assign(item, updatedItem);
//     res.json(item);
//   } else {
//     res.status(404).send('Item not found');
//   }
// });

// // Delete an item
// app.delete('/api/items/:id', (req, res) => {
//   const id = parseInt(req.params.id, 10);
//   items = items.filter(i => i.id !== id);
//   res.status(204).send(); // No content
// });




//------------sample routes practice---------------------------

// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next(); // Pass control to the next middleware or route handler
//   });

  
// app.get('/', (req,res)=>{
//     res.send('Hello World!!!')
// })

// app.get('/api/items', (req, res) => {
//     res.send('List of items');
//   });
  
//   app.post('/api/items', (req, res) => {
//     // Create a new item
//     res.send('Item created');
//   });
  
//   app.put('/api/items/:id', (req, res) => {
//     // Update an item with the given ID
//     res.send(`Item with ID ${req.params.id} updated`);
//   });
  
//   app.delete('/api/items/:id', (req, res) => {
//     // Delete an item with the given ID
//     res.send(`Item with ID ${req.params.id} deleted`);
//   });
  
app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`)
})

module.exports = app;