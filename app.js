const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const GlobalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./Routes/tourRoute');
const userRouter = require('./Routes/userRoute');
const reviewRouter = require('./Routes/reviewRoute');
const viewRouter = require('./Routes/viewRoute');
const bookingRouter = require('./Routes/bookingRoute');
const FavouriteRouter = require('./Routes/FavouriteRoute');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 1)GLOBAL MIDDLEWARES
//console.log(process.env.NODE_ENV);
//Set Security http header
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       useDefaults: true,
//       directives: {
//         'script-src': ["'self'", 'https://cdnjs.cloudflare.com/'],
//         'img-src': ["'self'", 'https: data:'],
//       },
//     },
//   }),
// );

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
// sets secure HTTP response headers

//Development login
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Limit requenst from same API
const limiter = rateLimit({
  max: 100,
  //This will allow 100 requests from same IP IN ONE Hour
  windowMs: 60 * 60 * 1000, //1 hour
  message: 'Too many requests from this IP, please try again in one hour!',
});
app.use('/api', limiter); // '/api' will affect the all routes which start from api url

// Body Parser, reading data from the body int req.body
app.use(express.json({ limit: '10kb' })); // express.json is ,middleware, is a function that can modify the incoming request data
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
//Data sanitization against NoSql Query Injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));
// app.use((req, res, next) => {
//   console.log('Hello from middleware 👋');

//   next();
// });
//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this end point');
// });
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

// 2) ROUTE HANDLERS
// const getAllTours = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       //tours: tours,
//       tours,
//     },
//   });
// };

// const getTour = (req, res) => {
//   console.log(req.params);
//   const id = req.params.id * 1;
//   const tour = tours.find((el) => el.id === id);

//   // if (id > tours.length)
//   if (!tour) {
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Invalid Id',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };

// const createTour = (req, res) => {
//   //console.log(req.body);

//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);
//   console.log(tours);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };

// const updateTour = (req, res) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Invalid Id',
//     });
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updates tour here...>',
//     },
//   });
// };

// const deleteTour = (req, res) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Invalid Id',
//     });
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };

// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

// const getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };
// const createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };
// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };
// app.get('/api/v1/tours', getAllTours); //route handler function

// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);
// 3) ROUTES

// const tourRouter = express.Router();
// const userRouter = express.Router();
// tourRouter.route('/').get(getAllTours).post(createTour);

// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

//   app.route('/api/v1/tours').get(getAllTours).post(createTour);

// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// app.route('/api/v1/users').get(getAllUsers).post(createUser);
// app
//   .route('/api/v1/users/:id')
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/favourite', FavouriteRouter);

//For other route which we have not defned!
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'Fail';
  // err.statusCode = 404;

  // next(err); // if next function contain err middleware no matter what are the middlewares in the middle it will switch global error handling middleware

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global Error handling middleware
app.use(GlobalErrorHandler);
// 4) START SERVER
// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}... `);
// });

module.exports = app;
