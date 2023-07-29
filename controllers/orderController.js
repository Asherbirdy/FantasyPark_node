const { StatusCodes } = require('http-status-codes');

const CustomError = require('../errors');
const UserTickets = require('../models/UserTickets');
const TicketCategory = require('../models/TicketCategory');
const Order = require('../models/Order');

const createTicketOrder = async (req, res) => {
  /* 
  測試：

  */

  // 如果是空值：-- 完成
  if (!req.body || !Array.isArray(req.body) || req.body.length === 0) {
    throw new CustomError.BadRequestError('Please provide values');
  }

  //票種必須是現在打開中的：true / false
  // ticketId不能有相同的
  // 9/31 不可以訂票

  // 他必須是這個 API 結構 -- 完成
  function hasRequiredProperties(arr) {
    return arr.every(
      (item) =>
        item.hasOwnProperty('ticketDate') &&
        item.hasOwnProperty('ticketId') &&
        item.hasOwnProperty('amount')
    );
  }

  if (!hasRequiredProperties(req.body)) {
    throw new CustomError.BadRequestError(
      "Every Object's keys need to have ticketDate,ticketId ,amount"
    );
  }

  // 檢查陣列中每個 ticketDate 是否都相同 -- 完成
  const areAllDatesSame = req.body.every((ticket, _, arr) => {
    return ticket.ticketDate === arr[0].ticketDate;
  });

  if (!areAllDatesSame) {
    throw new CustomError.BadRequestError(
      'The booking dates must be the same!'
    );
  }

  // 檢查日期是否是正確格式
  // function isValidDate(dateString) {
  //   const date = new Date(dateString);
  //   return date instanceof Date && !isNaN(date);
  // }

  // // 在處理 req.body 之前檢查日期的有效性
  // for (const ticket of req.body) {
  //   if (!isValidDate(ticket.ticketDate)) {
  //     throw new CustomError.BadRequestError(
  //       `ticketDate: ${ticket.ticketDate} is not available!`
  //     );
  //   }
  // }
  // 先看是否是今天，如果是今天，三點之前才能訂今天的票，如不是今天則看日期是否是明天以後 -- 完成
  function isToday(date) {
    const today = new Date();
    const parsedDate = new Date(date);
    return parsedDate.toDateString() === today.toDateString();
  }

  function isBeforeThreePM() {
    const now = new Date();
    const todayThreePM = new Date(now);
    todayThreePM.setHours(15, 0, 0, 0);
    return now < todayThreePM;
  }

  function isAfterToday(date) {
    const today = new Date();
    const parsedDate = new Date(date);

    return parsedDate >= today;
  }

  const parsedTicketDate = new Date(req.body[0].ticketDate);
  if (isToday(parsedTicketDate)) {
    if (!isBeforeThreePM()) {
      throw new CustomError.BadRequestError(
        'Booking for the same day is only allowed before 3 PM'
      );
    }
  } else if (!isAfterToday(parsedTicketDate)) {
    throw new CustomError.BadRequestError(
      'The booking date must be later than today'
    );
  } else {
  }

  // 如果有 unuse 票的時間 跟 買的時間 的票不一樣 返回Error
  const unuseTicket = await UserTickets.find({
    userId: req.user.userId,
    status: 'unuse',
  });

  if (unuseTicket && unuseTicket.length !== 0) {
    const unuseTicketDate =
      JSON.stringify(unuseTicket[0].ticketDate).slice(1, 11) + '';
    if (req.body[0].ticketDate !== unuseTicketDate) {
      throw new CustomError.BadRequestError(
        `A set of accounts can only make five ticket reservations on the same date. Booking Date${
          req.body[0].ticketDate.slice(0, 10) + ''
        };unuse ticket Date: ${unuseTicketDate} ${unuseTicket.length}張 `
      );
    }
  }

  // 一組帳號 只能有五張票
  const orderTicketsAmount = req.body.reduce((acc, cur) => acc + cur.amount, 0);
  if (orderTicketsAmount + unuseTicket.length > 5) {
    throw new CustomError.BadRequestError(
      `Each account can only have a maximum of five tickets; Unused tickets for this account: ${unuseTicket.length} tickets`
    );
  }

  let orderTickets = [];

  for (const ticket of req.body) {
    const dbTicket = await TicketCategory.findOne({
      _id: ticket.ticketId,
    });

    if (!dbTicket) {
      throw new CustomError.NotFoundError(
        `No Ticket with id ${ticket.ticketId}`
      );
    }

    const { _id, ticketType, fastTrack, price, description } = dbTicket;
    const singleOrderItem = {
      ticketId: _id,
      price, // 因為要看當時的價格，價格可能會調整，但是當時買的價格不能
      amount: ticket.amount,
      ticketInfo: `${ticketType} fastTrack:${fastTrack}`,
    };

    orderTickets.push(singleOrderItem);
  }

  const userTickets = [];
  let total = 0;
  for (const ticket of orderTickets) {
    total += ticket.price * ticket.amount;
    for (let i = 0; i < ticket.amount; i++) {
      userTickets.push({
        ticketId: ticket.ticketId,
        price: ticket.price,
        ticketInfo: ticket.ticketInfo,
      });
    }
  }

  const createOrder = await Order.create({
    purchaseDate: new Date(),
    ticket_date: req.body[0].ticketDate,
    total: total,
    orderTickets: userTickets,
    status: 'paid',
    userId: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json(createOrder);
};

const refundTicket = async (req, res) => {
  res.send('refund ticket order!!');
};

module.exports = { createTicketOrder, refundTicket };
