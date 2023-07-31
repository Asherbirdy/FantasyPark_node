const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const TicketCategory = require('../models/TicketCategory');

const UsersTickets = require('../models/UserTickets');

const getCurrentUserUnuseTicket = async (req, res) => {
  const getUnuseTicket = await UsersTickets.find({
    userId: req.user.userId,
    status: 'unuse',
  })
    .select('-purchaseDate -statusDate -__v -createdAt -updatedAt -userId')
    .populate('ticketCategoryId', 'ticketType fastTrack');
  res.status(StatusCodes.OK).json(getUnuseTicket);
};

module.exports = { getCurrentUserUnuseTicket };
