const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication');

const {
  ticketAuth,
  ticketAuthHistory,
} = require('../controllers/ticketAuthController');

router
  .route('/')
  .get(authenticateUser, authorizePermission('admin'), ticketAuthHistory);

router
  .route('/:id')
  .get(authenticateUser, authorizePermission('admin'), ticketAuth);

module.exports = router;
