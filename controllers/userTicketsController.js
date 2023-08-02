const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const TicketCategory = require('../models/TicketCategory');
const Order = require('../models/Order');
const UsersTickets = require('../models/UserTickets');
const { checkPersmission } = require('../utlis');
const getCurrentUserUnuseTicket = async (req, res) => {
  const getUnuseTicket = await UsersTickets.find({
    userId: req.user.userId,
    status: 'unuse',
  })
    .select('-purchaseDate -statusDate -__v -createdAt -updatedAt -userId')
    .populate('ticketCategoryId', 'ticketType fastTrack');
  res.status(StatusCodes.OK).json(getUnuseTicket);
};

// 產生訂單 再去裡面找票卷，產生訂單，再去改他的 userTickets 裏的 status
// 先不管日期之類
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

  const userTickets = [
    {
      _id: refundTicketId,
      ticketCategoryId: refundTicket.ticketCategoryId._id,
      price: refundTicket.ticketCategoryId.price,
      ticketInfo: `${refundTicket.ticketCategoryId.ticketType} fastTrack:${refundTicket.ticketCategoryId.fastTrack}`,
    },
  ];

  // 產生訂單 修改狀態
  const createRefundOrder = await Order.create({
    purchaseDate: new Date(),
    ticket_date: refundTicket.ticketDate,
    total: refundTicket.ticketCategoryId.price,
    orderTickets: userTickets,
    status: 'refund',
    userId: req.user.userId,
  });

  // 改變票的狀態和日期
  refundTicket.status = 'refund';
  refundTicket.statusDate = new Date();

  await refundTicket.save(); // Save the updated ticket

  res.status(StatusCodes.OK).json({ createRefundOrder, refundTicket });
};

module.exports = { getCurrentUserUnuseTicket, refundUserTicket };
