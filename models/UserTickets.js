const mongoose = require('mongoose');
const User = require('../models/User');

const UserTicketsSchema = new mongoose.Schema(
  {
    ticketCategoryId: {
      type: mongoose.Types.ObjectId,
      ref: 'TicketCategory',
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['unuse', 'used', 'expired', 'refund'],
        message:
          'Invalid status value. Status must be one of "unuse", "used", "expired", or "refund',
      },
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    statusDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ticketDate: {
      type: Date,
      required: true,
    },
    currentPurchasePrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UsersTickets', UserTicketsSchema);
