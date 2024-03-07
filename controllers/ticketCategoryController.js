const TicketCategory = require("../models/TicketCategory");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getAllTicketTypes = async (req, res) => {
  const getAllTicketTypes = await TicketCategory.find({});
  res.status(StatusCodes.OK).json({
    allTicketsInfo: getAllTicketTypes,
    count: getAllTicketTypes.length,
  });
};

const createTicketType = async (req, res) => {
  const { ticketType, fastTrack, price, description } = req.body;

  if (!ticketType || !price) {
    throw new CustomError.BadRequestError("Please provide ticketType, price");
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
  const { price, description, active } = req.body;
  const ticketType = await TicketCategory.findOne({ _id: req.params.id });
  ticketType.price = price;
  ticketType.description = description;
  ticketType.active = active;
  await ticketType.save();
  res.status(StatusCodes.OK).json({ ticketType });
};

const getActiveTicketType = async (req, res) => {
  let { page, limit } = req.body;
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  const skip = (page - 1) * limit;

  const ticketType = await TicketCategory.find({ active: true })
    .skip(skip)
    .limit(limit);
  const total = await TicketCategory.countDocuments({ active: true });

  res.status(StatusCodes.OK).json({
    activeTicket: ticketType,
    page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
  });
};

const getNonActiveTicketType = async (req, res) => {
  let { page, limit } = req.body;

  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  const skip = (page - 1) * limit;

  const ticketType = await TicketCategory.find({ active: false })
    .skip(skip)
    .limit(limit);
  const total = await TicketCategory.countDocuments({ active: false });

  res.status(StatusCodes.OK).json({
    nonActiveTicket: ticketType,
    page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
  });
};

module.exports = {
  getAllTicketTypes,
  createTicketType,
  updateTicketType,
  getActiveTicketType,
  getNonActiveTicketType,
};
