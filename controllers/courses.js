const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

// @desc Create a course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access private
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user._id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp is not found with id ${req.params.bootcampId}`
      )
    );
  }

  // Make sure bootcamp owner is logged in
  if (bootcamp.user.toString() !== req.user._id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to add courses to bootcamp ${bootcamp._id}`,
        401
      )
    );
  }

  const course = await Course.create(req.body);
  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc Get all courses
// @route GET /api/v1/courses
// @access private
exports.getCourses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get Single course by id
// @route GET /api/v1/courses/:id
// @access private
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course)
    return next(
      new ErrorResponse(`Course is not found with id ${req.params.id}`)
    );

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc Update course by id
// @route GET /api/v1/courses/:id
// @access private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    return next(
      new ErrorResponse(`Course with id ${req.params.id} is not found`, 404)
    );

  if (course.user.toString() !== req.user._id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to update course ${course._id}`,
        401
      )
    );
  }
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: updatedCourse,
  });
});

// @desc Delete course by id
// @route GET /api/v1/courses/:id
// @access private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course)
    return next(
      new ErrorResponse(`Course with id ${req.params.id} is not found`)
    );

  // Make sure user is course owner
  if (course.user.toString() !== req.user._id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to delete the course ${course._id}`,
        401
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: null,
  });
});

// @desc Get courses by bootcamp id
// @route GET /api/v1/courses/:bootcampId
// @access private
exports.getBootcampCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ bootcamp: req.params.bootcampId });
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
