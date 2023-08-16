require('dotenv').config();
require('express-async-errors');
// Express
const express = require('express');
const app = express();

// Rest of the package
const checkExpiredTickets = require('./tasks/ checkExpiredTicket');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

// const cors = require('cors');
// Database
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const ticketCategoryRouter = require('./routes/ticketCategoryRoutes');
const orderRouter = require('./routes/orderRoutes');
const userTicketsRouter = require('./routes/userTicketsRoutes');
const ticketAuthRouter = require('./routes/ticketAuthRoutes');

// Middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerrMiddleware = require('./middleware/error-handler');
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('./public'));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());
app.get('/', (req, res) => {
  res.send('Fantasy API');
});

app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies);
  res.send('Fantasy API');
});

checkExpiredTickets.start();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/ticketCategory', ticketCategoryRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/userTickets', userTicketsRouter);
app.use('/api/v1/authTicket', ticketAuthRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerrMiddleware);

app.set('trust proxy');
app.use(
  rateLimiter({
    windowMs: 15 * 6 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
