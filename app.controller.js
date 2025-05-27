import appError from './Error/appError.js';
import { errorHandler } from './Error/error.controller.js';
import authRouter from './modules/auth/auth.routes.js';
import bookingRouter from './modules/Bokking/booking.routes.js';
import revrouter from './modules/reviews/reviews.routes.js';
import templateRouter from './modules/Template/template.routes.js';
import router from './modules/Tours/tours.routes.js';
import urouter from './modules/Users/users.routes.js';

export const bootstrap = (app, express) => {
  app.use(express.json());

  app.use('/api/allTours', router);
  app.use('/api/allusers', urouter);
  app.use('/api/auth', authRouter);
  app.use('/api/reviews', revrouter);
  app.use('/api/booking', bookingRouter);
  app.use('/api/template', templateRouter);
  app.use(errorHandler);

  app.all('*', (req, res, next) => {
    next(new appError(`cant find ${req.originalUrl} on this server`));
  });
};
