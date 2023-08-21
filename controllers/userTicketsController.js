const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const Order = require('../models/Order');
const UsersTickets = require('../models/UserTickets');
const { checkPersmission } = require('../utlis');
const mongoose = require('mongoose');

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
    purchaseDate: new Date(),
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
  refundTicket.statusDate = new Date();

  await refundTicket.save(); // Save the updated ticket

  res.status(StatusCodes.OK).json({ createRefundOrder, refundTicket });
};

const getUnuseUseTickets = async (req, res) => {
  const findUnuseTicket = await getFilteredTickets({
    userId: req.user.userId,
    status: 'unuse',
  });

  const todayDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';

  const findTodayUnuseTicket = await getFilteredTickets({
    userId: req.user.userId,
    status: { $in: ['unuse', 'used'] },
    ticketDate: todayDate,
  });

  const ticketDateAsString = findTodayUnuseTicket[0]?.ticketDate.toISOString();

  if (findTodayUnuseTicket.length > 0 && ticketDateAsString === todayDate) {
    res
      .status(StatusCodes.OK)
      .json({ findTodayUnuseTicket, count: findTodayUnuseTicket.length });
  } else {
    res
      .status(StatusCodes.OK)
      .json({ findUnuseTicket, count: findUnuseTicket.length });
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

module.exports = {
  getCurrentUserUnuseTicket,
  refundUserTicket,
  getUnuseUseTickets,
};
