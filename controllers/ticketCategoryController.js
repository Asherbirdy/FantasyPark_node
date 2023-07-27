const TicketCategory = require('../models/TicketCategory');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const getAllTicketTypes = async (req, res) => {
  res.send('getAllTicketTypeInfo');
};

const createTicketType = async (req, res) => {
  res.send('createTicketType');
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
