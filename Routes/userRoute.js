const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
//const reviewController = require('./../controllers/reviewController');

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword); //This will receive only email address
router.patch('/resetPassword/:token', authController.resetPassword); //This will receive the token as well as the new passowrd

router.use(authController.protect); //This will protect all the routes which will come after this routes so we don't need to write 'authController.protect' again and agian

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin')); //This router will restrict to admin who can use router which is below from this route

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
