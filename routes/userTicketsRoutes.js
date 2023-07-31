const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication');

const {
  getCurrentUserUnuseTicket,
} = require('../controllers/userTicketsController');

router.route('/').get(authenticateUser, getCurrentUserUnuseTicket);

module.exports = router;
