const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
      },
      description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [200, 'Description cannot be more than 200 characters long'],
      },
      trigger: {
        type: Boolean,
        required: [true, 'Trigger is required'],
      }
});

const Item = mongoose.model('items', itemSchema);
module.exports = Item