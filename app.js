require('dotenv').config();
// Express
const express = require('express');
const app = express();

// Rest of the package
const morgan = require('morgan');

// Database
const connectDB = require('./db/connect');

// Middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerrMiddleware = require('./middleware/error-handler');
app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Fantasy API');
});

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
