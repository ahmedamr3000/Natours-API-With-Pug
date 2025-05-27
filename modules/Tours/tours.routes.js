import { Router } from 'express';
import {
  getAllTours,
  getOneTour,
  addTour,
  updateTour,
  removeTour,
  top5Tours,
  getTourStatus,
  getToursWithin,
  calcTheDestance,
  upload,
} from './tours.controller.js';
import { valdation } from '../../valdation/valdation.js';
import { tourValdationScema } from './valdation.scema.js';
import { validateUpdateData } from '../../valdation/valdationData.js';
import revrouter from '../reviews/reviews.routes.js';
import { protect, restrictTo } from '../auth/auth.controller.js';

const router = Router();

router.get('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin);
router.get('/distances/:latlng/unit/:unit', calcTheDestance);

router.get('/', getAllTours);

router.get('/status', getTourStatus);
router.get('/top5', top5Tours, getAllTours);

router.get('/:id', getOneTour);

// router.use(restrictTo('admin', 'lead-guide')); // add middle ware all next routes

router.post(
  '/',
  // valdation(tourValdationScema),
  protect,
  restrictTo('admin', 'lead-guide'),
  upload,
  addTour
);
router.patch(
  '/:id',
  validateUpdateData,
  protect,
  restrictTo('admin', 'lead-guide'),
  upload,

  updateTour
);

router.delete('/:id', protect, restrictTo('admin', 'lead-guide'), removeTour);

// nasted Route

router.use('/:tourid/reviews', revrouter);

export default router;
