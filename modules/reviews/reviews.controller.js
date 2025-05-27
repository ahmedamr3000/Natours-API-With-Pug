import Review from '../../moudels/reviews.js';
import { catchAsync } from '../../units/catchSync.js';
import {
  addOne,
  deleteOne,
  getAll,
  getOne,
  UpdateOne,
} from '../globalFactoryHandler/globalFactoryHandler.js';

export const getreviews = getAll(Review);

// export const getreviews = catchAsync(async (req, res, next) => {
//   let filter;

//   if (req.params.tourid) filter = { tour: req.params.tourid };

//   let reviews = await Review.find(filter);

//   res
//     .status(200)
//     .json({ status: 'success', results: reviews.length, data: reviews });
// });

export const setId = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourid;
  if (!req.body.user) req.body.user = req.user.id;
  next();
});

export const addreviews = addOne(Review);

// export const addreviews = catchAsync(async (req, res, next) => {
//   if (!req.body.tour) req.body.tour = req.params.tourid;
//   if (!req.body.user) req.body.user = req.user.id;

//   let reviews = await Review.create(req.body);

//   res.status(200).json({ status: 'success', data: reviews });
// });
// globalFactoryHandler
export const removeReview = deleteOne(Review);
export const getReview = getOne(Review);
export const UpdateReview = UpdateOne(Review);
