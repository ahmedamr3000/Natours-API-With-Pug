import { Router } from 'express';
import {
  addreviews,
  getReview,
  getreviews,
  removeReview,
  setId,
  UpdateReview,
} from './reviews.controller.js';
import { protect, restrictTo } from '../auth/auth.controller.js';

let revrouter = Router({ mergeParams: true }); // to get tourid from Tours Route

revrouter.get('/', getreviews);
revrouter.get('/:id', getReview);
// revrouter.use(restrictTo('user', 'admin')); // add middle ware all next routes
revrouter.use(protect); // add middle ware all next routes

revrouter.post('/', setId, restrictTo('user', 'admin'), addreviews);
revrouter.post('/:id', restrictTo('user', 'admin'), UpdateReview);
revrouter.delete('/:id', restrictTo('user', 'admin'), removeReview);

export default revrouter;
