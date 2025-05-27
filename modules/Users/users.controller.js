import fs from 'fs';
import { validationResult } from 'express-validator';
import usermodel from '../../moudels/userModel.js';
import appError from '../../Error/appError.js';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../../units/catchSync.js';
import {
  getAll,
  getOne,
  UpdateOne,
} from '../globalFactoryHandler/globalFactoryHandler.js';

//globalFactoryHandler
export const getAllUsers = getAll(usermodel);
export const getOneUsers = getOne(usermodel);
// export const updateUser = UpdateOne(usermodel);

// export const getAllUsers = catchAsync(async (req, res) => {
//   let users = await usermodel.find();
//   res.status(200).json({ status: 'sucess', data: users });
// });

// export const getOneUsers = catchAsync(async (req, res) => {
//   const userid = req.params.id;

//   let user = await usermodel.findById(userid);
//   if (!user) {
//     return res.status(404).json({ message: 'Not Found User ' });
//   }
//   res.status(200).json({ status: 'success', data: user });
// });

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await usermodel.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return res
      .status(404)
      .json({ status: 'fail', message: ' user not found ' });
  }

  res.status(200).json({ message: 'updated' });
});
