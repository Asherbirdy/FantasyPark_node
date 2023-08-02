const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication');
const {
  createTicketOrder,
  getUserOrderHistory,
} = require('../controllers/orderController');

router.route('/').post(authenticateUser, createTicketOrder);

router.route('/').get(authenticateUser, getUserOrderHistory);

module.exports = router;
