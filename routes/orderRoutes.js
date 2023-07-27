const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication');
const {
  createTicketOrder,
  refundTicket,
} = require('../controllers/orderController');

router.route('/').post(authenticateUser, createTicketOrder);
router.route('/refundTicket').post(authenticateUser, refundTicket);

module.exports = router;
