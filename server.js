require('dotenv').config();
const express = require('express');
const app = express();

// routes
const bootcamps = require('./routes/bootcamps');

// entry route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to devcamper API' });
});

// mount routes
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server listening in ${process.env.NODE_ENV} mode on ${PORT}`)
);
