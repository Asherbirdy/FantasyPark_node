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
  //  找 unuse 的票
  const findUnuseTicket = await UsersTickets.find({
    userId: req.user.userId,
    status: 'unuse',
  });

  // 今天的 string
  const todayDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
  const ticketDateAsString = findUnuseTicket[0]?.ticketDate.toISOString();

  // 找今天的unuse used票
  const findTodayUnuseTicket = await UsersTickets.find({
    userId: req.user.userId,
    status: { $in: ['unuse', 'used'] },
    ticketDate: todayDate,
  })
    .populate({
      path: 'ticketCategoryId',
      select: '_id ticketType fastTrack price', // 选择要包含的字段，用空格分隔
    })
    .select('-createdAt -updatedAt -__v -userId -statusDate') // 排除不想要的字段
    .lean();

  if (findUnuseTicket.length > 0 && ticketDateAsString === todayDate) {
    // 如果今天有票，顯示 今天 的 unuse票 和 used票
    res
      .status(StatusCodes.OK)
      .json({ findTodayUnuseTicket, count: findTodayUnuseTicket.length });
  } else {
    // 如果其他天有票或是沒票，顯示其他天的 unused票 或 空值
    res
      .status(StatusCodes.OK)
      .json({ findUnuseTicket, count: findUnuseTicket.length });
  }
};

module.exports = {
  getCurrentUserUnuseTicket,
  refundUserTicket,
  getUnuseUseTickets,
};
