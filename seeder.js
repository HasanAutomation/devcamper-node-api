require('dotenv').config();
require('colors');

const mongoose = require('mongoose');
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const bootcamps = require('./_data/bootcamps.json');
const courses = require('./_data/courses.json');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

async function insertBootcamps() {
  try {
    const bootcampsData = await Bootcamp.find();
    if (bootcampsData.length > 0) return;
    const addedBootcamps = bootcamps.map(bootcamp => {
      // delete bootcamp._id;
      return {
        ...bootcamp,
      };
    });
    await Bootcamp.create(addedBootcamps);
    console.log('BOOTCAMPS INSERTED'.green.bold);
    // await insertCourses();
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
}

async function insertCourses() {
  try {
    const coursesData = await Course.find();
    if (coursesData.length > 0) return;
    await Course.create(courses);
    console.log('COURSES INSERTED'.green.bold);
    // process.exit();
  } catch (err) {
    console.log(err.message);
  }
}

async function deleteBootcamps() {
  try {
    await Bootcamp.deleteMany();
    console.log('DELETED BOOTCAMPS'.red.bold);
    await deleteCourses();
    process.exit();
  } catch (err) {
    console.log(err);
  }
}
async function deleteCourses() {
  try {
    await Course.deleteMany();
    console.log('DELETED COURSES'.red.bold);
  } catch (err) {
    console.log(err);
  }
}

if (process.argv[2] === '-d') {
  deleteBootcamps();
} else {
  insertBootcamps();
}
