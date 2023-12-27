// const fs = require('fs');
const Tour = require('../models/tourModel');
const multer = require('multer');
const sharp = require('sharp');
//const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // console.log(req.files.imageCover);
  // console.log(req.files.images);
  if (!req.files.imageCover) return next();

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    }),
  );
  next();
});

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );
// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Invalid Id',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   console.log(`Tour Body is : ${req.body}`);
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);
// exports.getAllTours = catchAsync(async (req, res, next) => {
//   const Features = new APIFeatures(Tour.find(), req.query) //153 lecture // Made Query middleware for this (populate)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await Features.query;
//   res.status(200).json({
//     status: 'success',
//     // requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       //tours: tours,
//       tours,
//     },
//   });
//console.log(req.requestTime);
/*
  try {
    //console.log(req.query);
    //BUILD QUERY
    //1A)Filtering
    // const queryObj = { ...req.query }; //destructuring
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // //1B)Advance Filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // For filtering grater than, less than and so on...
    // console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr));
    // const query = Tour.find(queryObj);

    //2) Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   // console.log(sortBy);
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    //3) Feild limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v'); // - means excluding
    // }

    //4) PAGINATION
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // //page=2&limit=10  1-10 on page 1, 11-20 on page 2
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) {
    //     throw new Error('This page does not exist');
    //   }
    // }

    //EXECUTE QUERY
    const Features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await Features.query;
    // const query = Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });
    // const query =  Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //SEND REDPONSE
    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: tours.length,
      data: {
        //tours: tours,
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
  */
// });
exports.getTour = factory.getOne(Tour, { path: 'reviews' }); // path property is basically th field that we want to populate
/*
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  
  // const tour = await Tour.findById(req.params.id).populate({
  //   path: 'guides',
  //   select: '-__v -passwordChangedAt',
  // }); // 153 lecture // Made Query middleware for this (populate)
  
  // Tour.findOne({ _id : req.params.id })
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  */
/*
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id : req.params.id })
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
  */
// console.log(req.params);
// const id = req.params.id * 1;
// const tour = tours.find((el) => el.id === id);

// if (id > tours.length)
// if (!tour) {
//   return res.status(404).json({
//     status: 'Fail',
//     message: 'Invalid Id',
//   });
// }

// res.status(200).json({
//   status: 'success',
//   data: {
//     tour,
//   },
// });
//});

exports.createTour = factory.createOne(Tour);
// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// const newTour = new Tour();//In this version we called the method on the new document
// newTour.save();
// try {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// } catch (err) {
//   res.status(400).json({
//     status: 'Fail',
//     message: err,
//   });
// }
//In this version we called the method directly on the Tour
//console.log(req.body);
/*
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);

  // tours.push(newTour);
  // console.log(tours);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {

  //   },
  //);
  });
  */

exports.updateTour = factory.updateOne(Tour);
/*
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  /*
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
  });
  */
// if (req.params.id * 1 > tours.length) {}

exports.deleteTour = factory.deleteOne(Tour);
/*
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'Fail',
  //     message: 'Invalid Id',
  //   });
  // }
  /*
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: 'Invalid Id',
    });
  }
  });
  */
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: 'ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' }, // not equal (excluding)
    //   },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  /*
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          // _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: 'ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: {
      //     _id: { $ne: 'EASY' }, // not equal (excluding)
      //   },
      // },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: 'Invalid Id',
    });
  }
  */
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; //2021
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourstarts: { $sum: 1 },
        tour: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourstarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
  /*
  try {
    const year = req.params.year * 1; //2021
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourstarts: { $sum: 1 },
          tour: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numTourstarts: -1,
        },
      },
      {
        $limit: 12,
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: 'Invalid Id',
    });
  }
  */
});
//'/tours-within/:distance/center/:latlng/unit/:unit'
//'/tours-within/233/center/27.040413, 76.564939/unit/mi'
exports.getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radiusearthmiles = 3963.2;
  const radiusearthkilometer = 6378.1;
  const radius =
    unit === 'mi'
      ? distance / radiusearthmiles
      : distance / radiusearthkilometer;
  //console.log(radius);
  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat, lng. ',
        400,
      ),
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  //console.log(tours);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat, lng. ',
        400,
      ),
    );
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1], //Multiply by 1 for converts in numbers
        },

        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  const updatedDistances = distances.map((item) => ({
    ...item,
    distance: `${Math.round(item.distance * 1000) / 1000} ${unit}`,
  }));

  //This is only for first part(numeric) of the distance key
  // const updatedDistances1 = updatedDistances.map((item) => ({
  //   ...item,
  //   numericDistance: parseFloat(item.distance.replace(/[^\d.]/g, '')),
  // }));

  //console.log(distances);
  //console.log(updatedDistances);
  //console.log(updatedDistances1);
  res.status(200).json({
    status: 'success',
    data: {
      data: updatedDistances, //distances
    },
  });
});
