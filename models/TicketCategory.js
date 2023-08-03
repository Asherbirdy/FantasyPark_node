const mongoose = require('mongoose');

const TicketCategorySchema = new mongoose.Schema({
  ticketType: {
    type: String,
    required: [true, 'Please provide ticketType'],
    maxlength: 25,
    trim: true,
  },
  fastTrack: {
    type: Boolean,
    required: [true, 'Please provide fastTrack'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: 'Price should be greater than 0.',
    },
  },
  active: {
    type: Boolean,
    required: [true, 'Please provide active'],
  },
  description: {
    type: String,
    maxlength: 1000,
  },
});

module.exports = mongoose.model('TicketCategory', TicketCategorySchema);
