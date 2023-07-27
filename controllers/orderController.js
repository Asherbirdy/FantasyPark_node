const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createTicketOrder = async (req, res) => {
  res.send('create ticket order!!');
};

const refundTicket = async (req, res) => {
  res.send('refund ticket order!!');
};

module.exports = { createTicketOrder, refundTicket };
