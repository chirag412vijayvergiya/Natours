const express = require('express');
const authController = require('../controllers/authController');
const favouriteController = require('../controllers/favouriteController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(favouriteController.getFavourites)
  .post(favouriteController.setTourUserId, favouriteController.createfavorite);

module.exports = router;
