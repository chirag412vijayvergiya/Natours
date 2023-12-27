const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(200).render('base', {
//     tour: 'The Forest Hiker',
//     user: 'Jonas',
//   });
// });

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview,
);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

router.get('/me', authController.protect, viewsController.getAccount);

router.get('/signup', viewsController.getSignupForm);

router.get('/my-tours', authController.protect, viewsController.getMyTours);

router.get('/my-reviews', authController.protect, viewsController.getMyReviews);

router.get(
  '/my-favourites',
  authController.protect,
  viewsController.getMyFavourites,
);

router.get(
  '/all-bookings',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  viewsController.getAllBookings,
);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserdata,
// );
module.exports = router;
