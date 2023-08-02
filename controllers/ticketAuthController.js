const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const UsersTickets = require('../models/UserTickets');
const TicketAuthHistory = require('../models/TicketAuthHistory');
const ticketAuth = async (req, res) => {
  const { id } = req.params;

  const [userTicket] = await UsersTickets.find({ _id: id });

  if (userTicket.status !== 'unuse') {
    throw new CustomError.UnauthenticatedError(
      `Tickets is ${userTicket.status} , cannot be use!`
    );
  }

  const ticketDate = new Date(userTicket.ticketDate);
  const currentDate = new Date();
  const isNotToday =
    ticketDate.getFullYear() !== currentDate.getFullYear() ||
    ticketDate.getMonth() !== currentDate.getMonth() ||
    ticketDate.getDate() !== currentDate.getDate();

  if (isNotToday) {
    throw new CustomError.BadRequestError(`${ticketDate} is not today`);
  }

  // 都正確則執行：
  userTicket.status = 'used';
  userTicket.statusDate = new Date();
  userTicket.save();

  await TicketAuthHistory.create({
    date: new Date(),
    userId: userTicket.userId,
    ticketId: userTicket._id,
    ticketCategoryId: userTicket.ticketCategoryId,
  });
  res.status(StatusCodes.OK).json({ msg: '票券通過，可以入園' });
};

const ticketAuthHistory = async (req, res) => {
  res.send('ticketAuthHistory');
};

module.exports = { ticketAuth, ticketAuthHistory };
