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

router.route('/').get(getAllTicketTypes).post(createTicketType);

router.route('/:id').patch(updateTicketType);

router.route('/:id').delete(deleteTicketType);

module.exports = router;
