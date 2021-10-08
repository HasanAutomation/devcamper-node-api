require('dotenv').config();
require('colors');

const mongoose = require('mongoose');
const Bootcamp = require('./models/Bootcamp');
const bootcamps = require('./_data/bootcamps.json');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

async function insertBootcamps() {
  try {
    const bootcampsData = await Bootcamp.find();
    if (bootcampsData.length > 0) return;
    const addedBootcamps = bootcamps.map(bootcamp => {
      delete bootcamp._id;
      return {
        ...bootcamp,
      };
    });
    await Bootcamp.insertMany(addedBootcamps);
    console.log('INSERTED'.green.bold);
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
}

async function deleteBootcamps() {
  try {
    await Bootcamp.deleteMany();
    console.log('DELETED'.red.bold);
    process.exit();
  } catch (err) {
    console.log(err);
  }
}

if (process.argv[2] === '-d') {
  deleteBootcamps();
} else {
  insertBootcamps();
}
