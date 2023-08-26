const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const UsersTickets = require('../models/UserTickets');
const TicketAuthHistory = require('../models/TicketAuthHistory');

const { checkPersmission, convertToTaiwanTime } = require('../utlis');

// 現在台灣日期：2023-08-23T08:19:28.935Z
const todayTaiwanDate = convertToTaiwanTime(new Date());

// 把現在台灣時間 2023-08-23T08:19:28.935Z => 2023-08-23T00:00:00.000Z
const todayDate =
  todayTaiwanDate.toISOString().split('T')[0] + 'T00:00:00.000Z';

const ticketAuth = async (req, res) => {
  const { id } = req.params;

  const [userTicket] = await UsersTickets.find({ _id: id });

  if (userTicket.status !== 'unuse') {
    throw new CustomError.UnauthenticatedError(
      `票券狀態是 ${userTicket.status} , 不能使用!`
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

  if (isNotToday) {
    throw new CustomError.BadRequestError(`${ticketDate} 不是今天`);
  }

  // 都正確則執行：
  userTicket.status = 'used';
  userTicket.statusDate = convertToTaiwanTime(new Date());
  userTicket.save();

  await TicketAuthHistory.create({
    date: convertToTaiwanTime(new Date()),
    userId: userTicket.userId,
    ticketId: userTicket._id,
    ticketCategoryId: userTicket.ticketCategoryId,
  });
  res.status(StatusCodes.OK).json({ msg: '票券通過，可以入園' });
};

const ticketAuthHistory = async (req, res) => {
  const getTicketAuthHistory = await TicketAuthHistory.find({})
    .populate('userId', 'name email -_id')
    .populate('ticketCategoryId', '-_id fastTrack ticketType')
    .sort({ date: -1 });
  res.status(StatusCodes.OK).json(getTicketAuthHistory);
};

module.exports = { ticketAuth, ticketAuthHistory };
