require('dotenv').config();
require('express-async-errors');
// Express
const express = require('express');
const app = express();

// Rest of the package
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
// Database
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');

// Middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerrMiddleware = require('./middleware/error-handler');
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get('/', (req, res) => {
  res.send('Fantasy API');
});

app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies);
  res.send('Fantasy API');
});

app.use('/api/v1/auth', authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerrMiddleware);

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