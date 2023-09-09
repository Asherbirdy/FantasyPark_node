const { StatusCodes } = require('http-status-codes');

const CustomError = require('../errors');
const UserTickets = require('../models/UserTickets');
const TicketCategory = require('../models/TicketCategory');
const Order = require('../models/Order');
const dayjs = require('dayjs');
const { checkPersmission, convertToTaiwanTime } = require('../utlis');

// 現在台灣日期：2023-08-23T08:19:28.935Z
const todayTaiwanDate = convertToTaiwanTime(new Date());

// 把現在台灣時間 2023-08-23T08:19:28.935Z => 2023-08-23T00:00:00.000Z
const todayDate =
  todayTaiwanDate.toISOString().split('T')[0] + 'T00:00:00.000Z';

const {
  validateObjectsRequiredProperties,
  isValidDateFormat,
} = require('../utlis');

const createTicketOrder = async (req, res) => {
  /* 一組帳號 只能買五張票 */

  // req.body 不能是空值：
  if (!req.body || !Array.isArray(req.body) || req.body.length === 0) {
    throw new CustomError.BadRequestError('不能是空值');
  }

  // 他必須是這個 API 結構
  validateObjectsRequiredProperties(req.body, [
    'ticketDate',
    'ticketId',
    'amount',
  ]);

  // 票種必須是現在 active 打開：true / false
  const allTicketCategory = await TicketCategory.find({});
  function checkTicketsActiveStatus(ticketsToCheck, tickets) {
    const result = [];
    for (const ticketData of ticketsToCheck) {
      const { ticketId } = ticketData;
      const ticket = tickets.find((t) => t._id.toString() === ticketId);
      if (!ticket || !ticket.active) {
        result.push(ticketId);
      }
    }
    return result;
  }

  const notActiveTicket = checkTicketsActiveStatus(req.body, allTicketCategory);

  if (notActiveTicket.length > 0) {
    throw new CustomError.BadRequestError(`${notActiveTicket} 未啟動(active)`);
  }

  // ammount不能是0
  function validateAmounts(data) {
    // 遍历数据，检查是否有任何 "amount" 值小于等于零
    for (const item of data) {
      if (item.amount <= 0) {
        // 将检查条件修改为小于等于零
        return false; // 如果有任何一个 "amount" 值小于等于零，返回 false
      }
    }
    return true; // 如果所有 "amount" 值都大于零，返回 true
  }

  const inputData = req.body;

  if (!validateAmounts(inputData)) {
    throw new CustomError.BadRequestError(`amount 不能是0`);
  }

  // req.body ticketId不能有相同的
  function hasDuplicateTicketIds(jsonData) {
    const ticketIdsSet = new Set();
    for (const entry of jsonData) {
      const { ticketId } = entry;
      if (ticketIdsSet.has(ticketId)) {
        return true; // Duplicate ticketId found
      }
      ticketIdsSet.add(ticketId);
    }
    return false; // No duplicate ticketId found
  }

  if (hasDuplicateTicketIds(req.body)) {
    throw new CustomError.BadRequestError(`重複 ticketId`);
  }

  // 檢查陣列中每個 ticketDate 是否都相同 -- 完成
  const areAllDatesSame = req.body.every((ticket, _, arr) => {
    return ticket.ticketDate === arr[0].ticketDate;
  });

  if (!areAllDatesSame) {
    throw new CustomError.BadRequestError('訂票日期必須一樣!');
  }

  // 檢查JSON中的是否是“YYYY-MM-DD”
  isValidDateFormat(req.body[0].ticketDate);

  // 不能買昨天的票
  function isBeforeToday(date) {
    const nowTaiwanDate = new Date(
      convertToTaiwanTime(new Date()).toISOString().split('T')[0]
    );
    const dateWithSameDate = new Date(date.toISOString().split('T')[0]);
    return dateWithSameDate < nowTaiwanDate;
  }

  const parsedTicketDate = new Date(req.body[0].ticketDate);

  if (isBeforeToday(parsedTicketDate)) {
    throw new CustomError.BadRequestError('不能訂昨天以前的票！');
  }

  const todayDate =
    todayTaiwanDate.toISOString().split('T')[0] + 'T00:00:00.000Z';

  //如果今天unuse和used加起來有五張也不能購買
  const findTodayUnuseTicket = await UserTickets.find({
    userId: req.user.userId,
    status: { $in: ['unuse', 'used'] },
    ticketDate: convertToTaiwanTime(new Date()),
  });

  if (findTodayUnuseTicket.length + req.body.length > 5) {
    throw new CustomError.BadRequestError(
      '今天和今天所使用和購買的票數不能超過五張'
    );
  }

  // 如果有 unuse 票的時間 跟 買的時間 的票不一樣 返回Error --- 同時間
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
    const ticketCategory = await TicketCategory.findOne({
      _id: ticket.ticketId,
    });

    if (!ticketCategory) {
      throw new CustomError.NotFoundError(
        `No Ticket with id ${ticket.ticketId}`
      );
    }

    const { _id, ticketType, fastTrack, price, description } = ticketCategory;
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
        ticketCategoryId: ticket.ticketId,
        price: ticket.price,
        ticketInfo: ticket.ticketInfo,
      });
    }
  }

  const createOrder = await Order.create({
    purchaseDate: convertToTaiwanTime(new Date()),
    ticket_date: req.body[0].ticketDate,
    total: total,
    orderTickets: userTickets, // 使用 userTicketsIds 替代之前的 userTickets
    status: 'paid',
    userId: req.user.userId,
  });

  const userInfo = await Order.findById(createOrder._id)
    .populate({
      path: 'userId',
      select: '-password -__v -_id -role',
    })
    .populate({
      path: 'orderTickets.ticketCategoryId',
      model: 'TicketCategory',
      select: '-_id -__v -active -description -price',
    });

  // 給 userTicket collection
  const forUsersTickets = createOrder.orderTickets.map((ticket) => {
    return {
      _id: ticket._id,
      ticketCategoryId: ticket.ticketCategoryId,
      status: 'unuse',
      purchaseDate: convertToTaiwanTime(new Date()),
      statusDate: convertToTaiwanTime(new Date()),
      userId: req.user.userId,
      ticketDate: req.body[0].ticketDate,
      currentPurchasePrice: ticket.price,
    };
  });

  await UserTickets.insertMany(forUsersTickets);

  res.status(StatusCodes.CREATED).json(userInfo);
};

const getUserOrderHistory = async (req, res) => {
  const UserOrderHistory = await Order.find({
    userId: req.user.userId,
  });
  res.status(StatusCodes.OK).json(UserOrderHistory);
};

module.exports = { createTicketOrder, getUserOrderHistory };
