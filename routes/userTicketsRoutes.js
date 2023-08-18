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
} = require('../controllers/userTicketsController');

router.route('/').get(authenticateUser, getCurrentUserUnuseTicket);
router.route('/getTickets').get(authenticateUser, getUnuseUseTickets);
router.route('/refund/:id').get(authenticateUser, refundUserTicket);
module.exports = router;
