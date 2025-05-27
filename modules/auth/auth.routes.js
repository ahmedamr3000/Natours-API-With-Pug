import { Router } from 'express';
import {
  changeUserPass,
  deleUser,
  forgetPassword,
  login,
  logout,
  protect,
  regester,
  resetPassword,
  restrictTo,
  veryfy,
} from './auth.controller.js';
import { valdation } from '../../valdation/valdation.js';
import {
  loginValdationScema,
  resetPasswordScema,
  userresetPasswordScema,
  userValdationScema,
} from '../Users/userValdation.scema.js';

const authRouter = Router();

authRouter.post('/regester', valdation(userValdationScema), regester);
authRouter.post('/login', valdation(loginValdationScema), login);
authRouter.get('/logout', logout);
authRouter.get('/veryfy/:token', veryfy);
authRouter.post('/forgetPassword', forgetPassword);
authRouter.post(
  '/resetPassword/:token',
  valdation(resetPasswordScema),
  resetPassword
);

authRouter.put(
  '/changeUserPass',
  valdation(userresetPasswordScema),
  protect,
  changeUserPass
);
authRouter.use(restrictTo('admin', 'lead-guide')); // add middle ware all next routes

authRouter.delete(
  '/deleteUser/:id',
  protect,
  restrictTo('user', 'admin'),
  deleUser
);

export default authRouter;
