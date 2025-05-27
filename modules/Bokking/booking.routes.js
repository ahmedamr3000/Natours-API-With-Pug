import { Route, Router } from 'express';
import { protect } from '../auth/auth.controller.js';
import {
  createBookingCheckout,
  getCheckoutSession,
} from './booking.controller.js';

let bookingRouter = Router();

bookingRouter.get(
  '/checkout/:id',
  createBookingCheckout,
  protect,
  getCheckoutSession
);

export default bookingRouter;
