require('dotenv').config();
require('colors');
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const app = express();

// Connect database
connectDB();

// routes
const bootcamps = require('./routes/bootcamps');

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// entry route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to devcamper API' });
});

// mount routes
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server listening in ${process.env.NODE_ENV} mode on ${PORT} PORT`.yellow
      .bold
  )
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error:${err.message}`.red);
  server.close(() => process.exit(1));
});
