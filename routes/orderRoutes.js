const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication');
const {
  createTicketOrder,
  refundTicket,
  getUserOrderHistory,
} = require('../controllers/orderController');

router.route('/').post(authenticateUser, createTicketOrder);
router.route('/refundTicket').post(authenticateUser, refundTicket);
router.route('/').get(authenticateUser, getUserOrderHistory);

module.exports = router;
