const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Favourite = require('../models/FavouriteModel');

exports.setTourUserId = (req, res, next) => {
  //Allows nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getFavourites = factory.getAll(Favourite);
exports.createfavorite = factory.createOne(Favourite);
