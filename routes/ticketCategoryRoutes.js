const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication');

const {
  getAllTicketTypes,
  createTicketType,
  deleteTicketType,
  updateTicketType,
} = require('../controllers/ticketCategoryController');

router
  .route('/')
  .get(getAllTicketTypes)
  .post(authenticateUser, authorizePermission('admin'), createTicketType);

router
  .route('/:id')
  .patch(authenticateUser, authorizePermission('admin'), updateTicketType);

module.exports = router;
