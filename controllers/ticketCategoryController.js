const TicketCategory = require('../models/TicketCategory');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const getAllTicketTypes = async (req, res) => {
  const getAllTicketTypes = await TicketCategory.find({});
  res
    .status(StatusCodes.OK)
    .json({ getAllTicketTypes, count: getAllTicketTypes.length });
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

const updateTicketType = async (req, res) => {
  const { price, description } = req.body;
  const ticketType = await TicketCategory.findOne({ _id: req.params.id });
  ticketType.price = price;
  ticketType.description = description;

  await ticketType.save();
  res.status(StatusCodes.OK).json({ ticketType });
};

const deleteTicketType = async (req, res) => {
  res.send('deleteTicketType');
};

module.exports = {
  getAllTicketTypes,
  createTicketType,
  deleteTicketType,
  updateTicketType,
};
