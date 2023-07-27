const mongoose = require('mongoose');
const User = require('../models/User');
const TicketCategory = require('../models/TicketCategory');
const UserTickets = require('../models/UserTickets'); // 引入時使用完整檔案名稱

const OrderSchema = new mongoose.Schema({
  purchaseDate: {
    type: Date,
    required: true,
  },
  ticket_date: {
    type: Date,
    required: true,
  },
  orderTickets: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'UserTickets',
      required: true,
    },
  ],
  status: {
    type: String,
    enum: {
      values: ['unpaid', 'paid', 'failed', 'refunded'],
      message:
        'Invalid status value. Accepted values are unpaid, paid, failed, or refunded',
    },
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User', // 使用 'User' 作為參考來源，關聯 User 的模型
    required: true,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
