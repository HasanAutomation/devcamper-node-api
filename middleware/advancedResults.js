const asyncHandler = require('./async');

const advancedResults = (model, populate = null) =>
  asyncHandler(async (req, res, next) => {
    let query;

    const queryString = JSON.stringify(req.query).replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      match => `$${match}`
    );
    let selectValues;

    query = model.find(JSON.parse(queryString));

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
    const total = await model.countDocuments();

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

    if (populate) {
      query = query.populate(populate);
    }

    const results = await query;

    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    };
    next();
  });

module.exports = advancedResults;
