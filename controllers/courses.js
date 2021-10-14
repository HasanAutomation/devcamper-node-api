const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc Create a course
// @route POST /api/v1/courses
// @access private
exports.createCourse = asyncHandler(async (req, res, next) => {
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
  const courses = await Course.find().populate('bootcamp');

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
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
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true, runValidators: true }
  );

  if (!updatedCourse)
    return next(
      new ErrorResponse(`Course with id ${req.params.id} is not found`)
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
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course)
    return next(
      new ErrorResponse(`Course with id ${req.params.id} is not found`)
    );
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
