require('dotenv').config();
require('colors');
const express = require('express');
const morgan = require('morgan');
const app = express();

const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Connect database
connectDB();

// body parser
app.use(express.json());

// routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

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
app.use('/api/v1/courses', courses);

app.use(errorHandler);

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
