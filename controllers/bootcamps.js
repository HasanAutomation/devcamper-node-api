const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocode');

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access private
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  const queryString = JSON.stringify(req.query).replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );
  let selectValues;

  query = Bootcamp.find(JSON.parse(queryString)).populate('courses');

  // select
  if (req.query.select) {
    selectValues = req.query.select.split(',').join(' ');
    query = query.select(selectValues);
  }

  // sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  const pagination = {
    current: page,
  };
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  query = query.limit(limit).skip(startIndex);

  const bootcamps = await query;
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc Get Single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access private
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp is not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc Update a bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} is not found`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Create new bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} is not found`, 404)
    );
  }
  bootcamp.remove();
  res.status(200).json({ success: true, data: null });
});

// @desc Get bootcamp within a radius
// @route DELETE /api/v1/bootcamps/radius/:zipcode/:distance
// @access private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat abnd long
  const response = await geocoder.geocode(zipcode);
  const { latitude, longitude } = response[0];

  //  Calc radius using radians
  // Divide distance by Earth radius
  // Earth radius:3963 miles
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc Upload photo
// @route PUT /api/v1/bootcamps/:id/photo
// @access private
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found`, 404));
  if (!req.files) return next(new ErrorResponse('Please upload a photo', 400));

  const file = req.files.file;

  if (!file.mimetype.startsWith('image'))
    return next(new ErrorResponse('Images only', 400));

  if (file.size > process.env.MAX_FILE_UPLOAD)
    return next(
      new ErrorResponse(
        `Please upload an image less than ${
          process.env.MAX_FILE_UPLOAD / 1000000
        } mb`,
        400
      )
    );

  // create custom file name
  file.name = `${file.name.split('.')[0]}_photo_${req.params.id}${path.extname(
    file.name
  )}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem occurred while uploading`, 500));
    }
    await Bootcamp.findByIdAndUpdate(
      req.params.id,
      {
        $set: { photo: file.name },
        runValidators: true,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
