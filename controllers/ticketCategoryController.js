const TicketCategory = require('../models/TicketCategory');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const getAllTicketTypes = async (req, res) => {
  res.send('getAllTicketTypeInfo');
};

const createTicketType = async (req, res) => {
  const { ticketType, fastTrack, price, description } = req.body;

  if (!ticketType || !price) {
    throw new CustomError.BadRequestError('Please provide ticketType, price');
  }

  const ticketAlreadyExist = await TicketCategory.findOne({
    ticketType,
    fastTrack,
  });

  if (ticketAlreadyExist) {
    throw new CustomError.BadRequestError(
      `ticketType:${ticketType}  fastTrack:${fastTrack} is already exist!`
    );
  }

  const ticket = await TicketCategory.create(req.body);

  res.status(StatusCodes.CREATED).json(ticket);
};

const deleteTicketType = async (req, res) => {
  res.send('deleteTicketType');
};

const updateTicketType = async (req, res) => {
  res.send('updateTicketType');
};

module.exports = {
  getAllTicketTypes,
  createTicketType,
  deleteTicketType,
  updateTicketType,
};
