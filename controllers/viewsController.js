const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Favourite = require('../models/FavouriteModel');
const Bookings = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) Get tour data from collection
  const tours = await Tour.find();

  //2) Build Template

  //3)Render that template using tour data from 1)

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requseted tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }

  //2) Build template
  //3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  //1) FIND ALL BOOKINGS
  const bookings = await Bookings.find({ user: req.user.id });
  //2) FIND TOURS WITH THE TUOUR ID
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  //console.log(bookings);

  // if (bookings.length === 0) {
  //   return next(new AppError('Please book Tour 😁!', 304));
  // }
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.getAllBookings = async (req, res, next) => {
  const bookings = await Bookings.find();
  const tourIDs = bookings.map((el) => el.tour);

  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
};
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Make your Account!',
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in to your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserdata = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

exports.getMyReviews = async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id }).populate({
    path: 'tour',
    fields: 'review rating user',
  });
  //console.log(reviews);
  //const tourID = reviews.map((el) => el.tour);
  //console.log(tourID);
  //const tours = await Tour.find({ _id: { $in: tourID } });

  res.status(200).render('review', {
    title: 'My Reviews',
    reviews,
  });
};

exports.getMyFavourites = async (req, res, next) => {
  const favourite = await Favourite.find({ user: req.user.id });

  const tourIDs = favourite.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  console.log(favourite);

  res.status(200).render('overview', {
    title: 'My Favourites',
    tours,
  });
};
