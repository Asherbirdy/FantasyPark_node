const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication');

const {
  getCurrentUserUnuseTicket,
  refundUserTicket,
  getUnuseUseTickets,
  getUserUsedRefundExpiredTicketHistory,
} = require('../controllers/userTicketsController');

router.route('/').get(authenticateUser, getCurrentUserUnuseTicket);
router
  .route('/ticketHistory')
  .get(authenticateUser, getUserUsedRefundExpiredTicketHistory);
router.route('/getTickets').get(authenticateUser, getUnuseUseTickets);
router.route('/refund/:id').get(authenticateUser, refundUserTicket);
module.exports = router;
