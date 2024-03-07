const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication');

const {
  getAllTicketTypes,
  createTicketType,
  updateTicketType,
  getActiveTicketType,
  getNonActiveTicketType
} = require('../controllers/ticketCategoryController');

router
  .route('/')
  .get(getAllTicketTypes)
  .post(authenticateUser, authorizePermission('admin'), createTicketType);

router
  .route('/active')
  .get(authenticateUser, authorizePermission('admin'), getActiveTicketType)

router
  .route('/nonActive')
  .get(authenticateUser, authorizePermission('admin'), getActiveTicketType)

router
  .route('/:id')
  .patch(authenticateUser, authorizePermission('admin'), updateTicketType);

module.exports = router;
