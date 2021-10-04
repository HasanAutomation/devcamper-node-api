// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access private
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Show all bootcamps' });
};

// @desc Get Single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access private
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Show bootcamp' });
};

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Create bootcamp' });
};

// @desc Update a bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Update bootcamp' });
};

// @desc Create new bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Delete bootcamp' });
};
