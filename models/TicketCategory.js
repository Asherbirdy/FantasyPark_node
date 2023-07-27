const mongoose = require('mongoose');

const TicketCategorySchema = new mongoose.Schema({
  ticketType: {
    type: String,
    enum: ['adult', 'kids', 'concession'],
    required: [true, 'Please provide ticketType'],
    maxlength: 25,
  },
  fastTrack: {
    type: Boolean,
    required: [true, 'Please provide fastTrack'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
  },
});

module.exports = mongoose.model('TicketCategory', TicketCategorySchema);
