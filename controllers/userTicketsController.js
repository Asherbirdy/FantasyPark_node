const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const Order = require('../models/Order');
const UsersTickets = require('../models/UserTickets');
const { checkPersmission, convertToTaiwanTime } = require('../utlis');
const mongoose = require('mongoose');

// 現在台灣日期：2023-08-23T08:19:28.935Z
const todayTaiwanDate = convertToTaiwanTime(new Date());

// 把現在台灣時間 2023-08-23T08:19:28.935Z => 2023-08-23T00:00:00.000Z
const todayDate =
  todayTaiwanDate.toISOString().split('T')[0] + 'T00:00:00.000Z';

const getCurrentUserUnuseTicket = async (req, res) => {
  const getUnuseTicket = await UsersTickets.find({
    userId: req.user.userId,
    status: 'unuse',
  })
    .select('-purchaseDate -statusDate -__v -createdAt -updatedAt -userId')
    .populate('ticketCategoryId', 'ticketType fastTrack');

  res
    .status(StatusCodes.OK)
    .json({ getUnuseTicket, count: getUnuseTicket.length });
};

// 產生訂單 再去裡面找票卷，產生訂單，再去改他的 userTickets 裏的 status
const refundUserTicket = async (req, res) => {
  const { id: refundTicketId } = req.params;

  const refundTicket = await UsersTickets.findById(refundTicketId).populate(
    'ticketCategoryId',
    'ticketType fastTrack price'
  );
  if (!refundTicket) {
    throw new CustomError.NotFoundError('Ticket not found');
  }

  const getUserIdbyString = { userId: refundTicket.userId.toString() };
  checkPersmission(req.user, getUserIdbyString);

  if (refundTicket.status !== 'unuse') {
    throw new CustomError.UnauthenticatedError(
      `'Ticket is ${refundTicket.status}! Can not be refund!'`
    );
  }

  // 找出當時訂單的價格
  const currentOrderPrice = await Order.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(req.user.userId) } },
    { $unwind: '$orderTickets' },
    {
      $match: {
        'orderTickets._id': mongoose.Types.ObjectId(refundTicketId),
        'orderTickets.ticketCategoryId': refundTicket.ticketCategoryId._id,
      },
    },
    { $project: { _id: 0, price: '$orderTickets.price' } },
  ]);

  // 產生訂單 修改狀態 ( 需要改total 和 price )
  const createRefundOrder = await Order.create({
    purchaseDate: convertToTaiwanTime(new Date()),
    ticket_date: refundTicket.ticketDate,
    total: currentOrderPrice[0].price,
    orderTickets: {
      _id: refundTicketId,
      ticketCategoryId: refundTicket.ticketCategoryId._id,
      price: currentOrderPrice[0].price,
      ticketInfo: `${refundTicket.ticketCategoryId.ticketType} fastTrack:${refundTicket.ticketCategoryId.fastTrack}`,
    },
    status: 'refund',
    userId: req.user.userId,
  });

  // 改變票的狀態和日期
  refundTicket.status = 'refund';
  refundTicket.statusDate = convertToTaiwanTime(new Date());

  await refundTicket.save(); // Save the updated ticket

  res.status(StatusCodes.OK).json({ createRefundOrder, refundTicket });
};

const getUnuseUseTickets = async (req, res) => {
  const findUnuseTicket = await getFilteredTickets({
    userId: req.user.userId,
    status: 'unuse',
  });

  const findTodayUnuseTicket = await getFilteredTickets({
    userId: req.user.userId,
    status: { $in: ['unuse', 'used'] },
    ticketDate:
      convertToTaiwanTime(new Date()).toISOString().split('T')[0] +
      'T00:00:00.000Z',
  });

  const ticketDateAsString = findTodayUnuseTicket[0]?.ticketDate.toISOString();

  if (
    findTodayUnuseTicket.length > 0 &&
    convertToTaiwanTime(new Date()).toISOString().split('T')[0] +
      'T00:00:00.000Z' ===
      findTodayUnuseTicket[0]?.ticketDate.toISOString()
  ) {
    res.status(StatusCodes.OK).json(findTodayUnuseTicket);
  } else {
    res.status(StatusCodes.OK).json(findUnuseTicket);
  }
};

const getFilteredTickets = async (filter) => {
  return await UsersTickets.find(filter)
    .populate({
      path: 'ticketCategoryId',
      select: '_id ticketType fastTrack price',
    })
    .select('-createdAt -updatedAt -__v -userId ')
    .lean();
};

const getUserUsedRefundExpiredTicketHistory = async (req, res) => {
  const ticketHistroy = await UsersTickets.find({
    userId: req.user.userId,
    status: { $in: ['expired', 'refund', 'used'] },
  })
    .populate({
      path: 'ticketCategoryId',
      select: '_id ticketType fastTrack price',
    })
    .select(
      'ticketDate status ticketCategoryId currentPurchasePrice statusDate'
    )
    .sort({ statusDate: -1 });
  res.status(StatusCodes.OK).json(ticketHistroy);
};

module.exports = {
  getCurrentUserUnuseTicket,
  refundUserTicket,
  getUnuseUseTickets,
  getUserUsedRefundExpiredTicketHistory,
};
