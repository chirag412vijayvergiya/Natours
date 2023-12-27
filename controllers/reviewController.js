const Review = require('../models/reviewModel');
//const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllReview = factory.getAll(Review);
/*
exports.getAllReview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const review = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    results: review.length,
    data: {
      review,
    },
  });
});
*/
exports.setTourUserIds = (req, res, next) => {
  //Allows nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

/*
exports.createReview = catchAsync(async (req, res, next) => {
  //Allows nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      Review: newReview,
    },
  });
});
*/
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
