const {
  getCourses,
  getCourse,
  getBootcampCourses,
  updateCourse,
  deleteCourse,
  createCourse,
} = require('../controllers/courses');
const advancedResults = require('../middleware/advancedResults');
const Course = require('../models/Course');

const router = require('express').Router({ mergeParams: true });

router
  .route('/')
  .get(advancedResults(Course, 'bootcamp'), getCourses)
  .post(createCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);
router.route('/bootcamp/:bootcampId').get(getBootcampCourses);

module.exports = router;
