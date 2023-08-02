const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication');

const {
  getCurrentUserUnuseTicket,
  refundUserTicket,
} = require('../controllers/userTicketsController');

router.route('/').get(authenticateUser, getCurrentUserUnuseTicket);
router.route('/refund/:id').post(authenticateUser, refundUserTicket);
module.exports = router;
