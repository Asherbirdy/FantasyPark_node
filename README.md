# FantasyPark_node（ＴＥＳＴ）
# 資料庫設計

｀

```jsx
name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
```

### 票型collections (TicketCategory.js)

```jsx
const mongoose = require('mongoose');

const TicketCategorySchema = new mongoose.Schema({
  ticketType: {
    type: String,
    required: [true, 'Please provide ticketType'],
    maxlength: 25,
    trim: true,
  },
  fastTrack: {
    type: Boolean,
    required: [true, 'Please provide fastTrack'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: 'Price should be greater than 0.',
    },
  },
  description: {
    type: String,
    maxlength: 1000,
  },
});

module.exports = mongoose.model('TicketCategory', TicketCategorySchema);

/*
API:
1. 取得所有票種資訊
2. 新增票種資訊
3. 刪除票種資訊
4. 更新票種資訊
*/
```

### 票 collections (Tickets.js)

```jsx
// 備註：不分數量是因為每一張QRCode是獨立的
const UsersTicketsSchema = new mongoose.Schema(

// API
// 1.查看 帳號 目前可使用票券
// 2.查看 帳號 歷史定票資訊 可以設定只顯示幾筆

```

### 訂單 collections (Order.js)

```jsx
{
	"_id":"5d6a0d9b1e7f7d4f8bd9a0c7", // ObjectID
"pushase_date":"2023-06-27",
	"ticket_date":"2023-07-27",
  "orderTickets": [
    "5d6a0d9b1e7f7d4f8bd9a0c7",
    "5d6a0d9b1e7f7d4f8bd9a0c8",
    "5d6a0d9b1e7f7d4f8bd9a0c9"
  ],
  "status": "paid", //  未付款（unpaid）  / 已付款（paid） / 失敗(failed) / 退款(refunded)
  "user_id": "5d6a0d9b1e7f7d4f8bd9a0c7"
}

// 產生訂單
// 1.查看 帳號 歷史定票資訊 可以設定只顯示幾筆
// 2.退票
```

驗票系統

一個ＰＯＳＴ