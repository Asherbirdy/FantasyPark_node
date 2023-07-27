const mongoose = require('mongoose');
const User = require('../models/User');
const TicketCategory = require('../models/TicketCategory');

const UsersTicketsSchema = new mongoose.Schema(
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
    statusDate: {
      type: Date,
      required: true,
    },
    qrcode: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UsersTickets', UsersTicketsSchema);
