const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
      },
      email: {
        type: String,
        required: [true, 'Description is required'],
      }

});

const Details = mongoose.model('Details', itemSchema);
module.exports = Details