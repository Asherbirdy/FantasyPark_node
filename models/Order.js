const mongoose = require('mongoose');

const SingleOrderSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  price: { type: Number, required: true },
  ticketInfo: {
    type: String,
  },
});

const OrderSchema = new mongoose.Schema({
  purchaseDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  ticket_date: {
    type: Date,
    required: true,
  },
  orderTickets: [SingleOrderSchema],
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
  total: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
