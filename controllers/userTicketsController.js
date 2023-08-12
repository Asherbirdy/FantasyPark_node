const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const TicketCategory = require('../models/TicketCategory');
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
  /*
找目前unuse的票:
  有unuse->去判斷 是否是今天。
	  如果是今天：抓今天的unuse和used
	  如果不是今天：顯示全部unuse票

  沒有任何unuse票->去判斷 是不是今天的票用完
	  如果今天有使用票：顯示今天used的票
	  如果今天沒有使用票：回傳error msg:使用者沒票 趕緊去買票
*/

  // // 找今天的票
  // const findUnuseTicket = await UsersTickets.find({
  //   userId: req.user.userId,
  //   status: 'unuse',
  // });
  // const todayDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
  // // 如果沒有unuse的票，就找看看有沒有今天用完的票
  // if (findUnuseTicket.length === 0) {
  //   const findTodayUsedTickets = await UsersTickets.find({
  //     userId: req.user.userId,
  //     status: 'used',
  //     ticketDate: todayDate,
  //   });
  //   if (!findTodayUsedTickets) {
  //     throw new CustomError.NotFoundError('沒有任何票');
  //   }
  //   res
  //     .status(StatusCodes.OK)
  //     .json({ findTodayUsedTickets, count: findTodayUsedTickets.length });
  // } else {
  //   res
  //     .status(StatusCodes.OK)
  //     .json({ findUnuseTicket, count: findUnuseTicket.length });
  // }
  // res
  //   .status(StatusCodes.OK)
  //   .json({ getUseUnuseTickets, count: getUseUnuseTickets.length });
  res.send('getUnuseUseTickets');
};

module.exports = {
  getCurrentUserUnuseTicket,
  refundUserTicket,
  getUnuseUseTickets,
};
