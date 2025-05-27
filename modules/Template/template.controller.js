import { catchAsync } from '../../units/catchSync.js';
import Tour from '../../moudels/TourModel.js';
import appError from '../../Error/appError.js';
import booking from '../../moudels/booking.js';

export const overview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
export const tour = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;

  const tour = await Tour.findById(tourId).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  if (!tour) {
    return next(new appError('There is no tour with that ID', 404));
  }

  res.status(200).render('tour', {
    title: tour.name,

    tour,
  });
});

export const login = catchAsync(async (req, res, next) => {
  try {
    res.status(200).render('login', {
      title: 'Login',
    });
  } catch (err) {
    next(err);
  }
});

export const account = catchAsync(async (req, res, next) => {
  console.log('hello');

  res.status(200).render('account', {
    title: 'Your account',
  });
});
export const getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await booking.find({ user: req.user.id });
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', {
    title: 'MY Tours',
    tours,
  });
});
