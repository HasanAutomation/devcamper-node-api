const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc Register a user
// @route POST /api/v1/auth/register
// @access public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  //   Create User
  const user = await User.create({ name, email, password, role });

  sendTokenResponse(user, 201, res);
});

// @desc Login a user
// @route POST /api/v1/auth
// @access public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) return next(new ErrorResponse('Please provide an email', 400));
  if (!password)
    return next(new ErrorResponse('Please provide a password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new ErrorResponse('Invalid credentials', 401));

  // Check Password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(new ErrorResponse('Invalid credentails', 401));

  sendTokenResponse(user, 200, res);
});

// Get Token from model,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie('access_token', token, options)
    .json({ success: true, token });
};
