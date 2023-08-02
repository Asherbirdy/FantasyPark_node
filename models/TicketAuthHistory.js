const mongoose = require('mongoose');

const TicketAuthHistory = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ticketId: {
    type: mongoose.Types.ObjectId,
    ref: 'UsersTickets',
    required: true,
  },
  ticketCategoryId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
});

module.exports = mongoose.model('TicketAuthHistory', TicketAuthHistory);
