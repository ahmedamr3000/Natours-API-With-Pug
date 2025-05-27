import { validationResult } from 'express-validator';
import Tour from '../../moudels/TourModel.js';
import APIFeatures from './apiFiltration.js';
import appError from '../../Error/appError.js';
import Review from '../../moudels/reviews.js';
import jwt from 'jsonwebtoken';
import usermodel from '../../moudels/userModel.js';
import { catchAsync } from '../../units/catchSync.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import {
  addOne,
  deleteOne,
  getAll,
  getOne,
  UpdateOne,
} from '../globalFactoryHandler/globalFactoryHandler.js';

// top 5
export const top5Tours = catchAsync(async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';

  next();
});
export const calcTheDestance = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiple = unit === 'mi' ? 0.00621371 : 0.001;
  if (!lat || !lng) {
    next(
      new appError(
        'please provide latiutr and longitude in the format lat , lng  ',
        400
      )
    );
  }

  const destance = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiple,
      },
    },
    {
      $project: {
        distance: 1,

        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: destance.length,
    data: {
      data: destance,
    },
  });
});

export const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(
      new appError(
        'please provide latiutr and longitude in the format lat , lng  ',
        400
      )
    );
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});
// globalFactoryHandler
export const getAllTours = getAll(Tour);
export const getOneTour = getOne(Tour, 'reviews', 'guides');
// export const addTour = addOne(Tour);
// export const updateTour = UpdateOne(Tour);
export const removeTour = deleteOne(Tour);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'User_Images',
    resource_type: 'image',
    allowedFormats: ['jpg', 'jpeg', 'png'],
  },
});

export const upload = multer({ storage }).array('images', 4);

export const addTour = catchAsync(async (req, res) => {
  const {
    name,
    maxGroupSize,
    difficulty,
    guides,
    price,
    summary,
    description,
  } = req.body;

  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'No images uploaded' });
  }

  if (req.files.length > 4) {
    return res.status(400).json({
      status: 'fail',
      message: 'You can upload up to 4 images only',
    });
  }

  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Please upload at least one image.' });
  }
  const imageUrls = req.files.map((file) => file.path);

  const newTour = new Tour({
    name,
    maxGroupSize,
    difficulty,
    summary,
    guides,
    price,
    description,
    images: imageUrls,
  });

  await newTour.save();
  res.status(201).json({
    status: 'success',
    message: 'Tour added successfully',
    product: newTour,
  });
});

// export const getAllTours = catchAsync(async (req, res) => {
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;

//   res.status(200).json({
//     status: 'success',
//     // timee: req.requestTime,
//     result: tours.length,
//     data: tours,
//   });
// });

// export const getOneTour = catchAsync(async (req, res) => {
//   const tourId = req.params.id;

//   if (!tourId) {
//     return res.status(400).json({ message: 'enter ID' });
//   }

//   let tour = await Tour.findById(tourId).populate('reviews');
//   if (!tour) {
//     return res.status(404).json({ message: ' tour not found' });
//   }

//   res.status(200).json({ status: 'success', data: tour });
// });

export const updateTour = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      duration,
      maxGroupSize,
      difficulty,
      ratingsAverage,
      ratingsQuantity,
      price,
      summary,
      description,
      imageCover,
      guides,
      startDates,
      locations,
      removeImages,
    } = req.body;

    let tour = await Tour.findById(id);
    if (!tour) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Tour not found' });
    }

    const removeImagesArray =
      typeof removeImages === 'string' ? [removeImages] : removeImages;

    if (removeImagesArray && removeImagesArray.length > 0) {
      tour.images = tour.images.filter(
        (img) => !removeImagesArray.includes(img)
      );
    }

    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map((file) => file.path);

      tour.images = [...tour.images, ...imageUrls];
    }

    tour.name = name || tour.name;
    tour.duration = duration || tour.duration;
    tour.maxGroupSize = maxGroupSize || tour.maxGroupSize;
    tour.difficulty = difficulty || tour.difficulty;
    tour.ratingsAverage = ratingsAverage || tour.ratingsAverage;
    tour.ratingsQuantity = ratingsQuantity || tour.ratingsQuantity;
    tour.price = price || tour.price;
    tour.summary = summary || tour.summary;
    tour.description = description || tour.description;
    tour.imageCover = imageCover || tour.imageCover;
    tour.guides = guides || tour.guides;
    tour.startDates = startDates || tour.startDates;
    tour.locations = locations || tour.locations;

    await tour.save();

    res.status(200).json({
      status: 'success',
      message: 'Tour updated successfully',
      tour,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', message: error.message });
  }
});

// export const removeTour = catchAsync(async (req, res) => {
//   let tourId = req.params.id;
//   if (!tourId) {
//     return res.status(400).json({ status: 'fail', message: ' invalid id ' });
//   }

//   let tour = await Tour.findByIdAndDelete(tourId);

//   if (!tour) {
//     return res
//       .status(404)
//       .json({ status: 'fail', message: ' tour not found ' });
//   }

//   res.status(200).json({ status: 'success', message: ' Tour Deleted' });
// });

export const getTourStatus = catchAsync(async (req, res) => {
  const status = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        num: { $sum: 1 },
        sumrating: { $sum: '$ratingsQuantity' },
        avrgrating: { $avg: '$ratingsAverage' },
        avgprice: { $avg: '$price' },
        minprice: { $min: '$price' },
        maxprice: { $max: '$price' },
      },
    },
    {
      $sort: { avgprice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    // timee: req.requestTime,
    result: status.length,
    data: status,
  });
});
