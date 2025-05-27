import usermodel from '../../moudels/userModel.js';
import bcrypt from 'bcrypt';
import send from '../../comfermEmail/sendmail.js';
import jwt from 'jsonwebtoken';
import appError from '../../Error/appError.js';
import crypto from 'crypto';
import { token } from 'morgan';
import { catchAsync } from '../../units/catchSync.js';
import { promisify } from 'util';

export const regester = catchAsync(async (req, res) => {
  const { name, email, password, repassword, comfirmEmail, phone } = req.body;

  if (password != repassword) {
    return res
      .status(400)
      .json({ message: ' password and repassword must be match  ' });
  }

  if (await usermodel.findOne({ email: email })) {
    return res.status(400).json({ message: ' this email alrady used ' });
  }

  let hashedPassword = bcrypt.hashSync(password, 8);

  let user = await usermodel.create({
    name,
    email,
    password: hashedPassword,
    comfirmEmail,
    phone,
  });
  let token = jwt.sign(email, 'ITI');

  let objuser = user.toObject();
  delete objuser.password;
  let url = `http://localhost:4200/auth/veryfy/${token}`;

  send(email, url);

  res
    .status(201)
    .json({ status: 'success', message: 'acount has been created' });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  let theuser = await usermodel.findOne({ email });
  if (!theuser) {
    return res.status(400).json({ message: 'invalid email' });
  }

  let result = bcrypt.compareSync(password, theuser.password);
  if (!result) {
    return res.status(400).json({ message: 'invalid password' });
  }

  createSendToken(theuser, 201, req, res);
});

const createSendToken = (user, statusCode, req, res) => {
  const token = jwt.sign({ id: user._id }, process.env.SECRET, {
    expiresIn: process.env.EXPIR_DATE,
  });

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + Number(process.env.EXPIR_COOKEI_DATE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const veryfy = catchAsync(async (req, res) => {
  try {
    const { token } = req.params;
    let decoded = jwt.verify(token, 'ITI');

    let userr = await usermodel.findOne({ email: decoded });
    if (!userr) return res.status(404).json({ message: 'email not found' });

    await usermodel.findByIdAndUpdate(
      userr._id,
      { comfirmEmail: true },
      { new: true }
    );
  } catch (error) {}

  res.status(200).json({ message: 'updated' });
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  const user = await usermodel.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError('User Not Found', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const message = ` restCode is :  ${resetToken}`;
  send(req.body.email, message, 'forgot');

  res
    .status(200)
    .json({ status: 'success', message: 'Reset code sent to email' });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  if (!req.params.token) {
    return next(new appError('Reset token is missing', 400));
  }

  const user = await usermodel.findOne({
    passwordResetToken: hashToken,
    passwordResetTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new appError('Invalid or expired reset code', 400));
  }

  const { newpassword, repassword } = req.body;

  if (newpassword !== repassword) {
    return next(new appError('New passwords do not match', 400));
  }

  let hashedPassword = bcrypt.hashSync(newpassword, 8);

  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  await user.save();

  res
    .status(200)
    .json({ status: 'success', message: 'Password updated successfully' });
});

export const changeUserPass = catchAsync(async (req, res, next) => {
  const { oldpassword, newpassword, repassword } = req.body;

  let user = await usermodel.findById(req.user.id);
  if (!user) {
    return next(new appError('the user not found', 404));
  }

  let result = bcrypt.compareSync(oldpassword, user.password);

  if (newpassword !== repassword) {
    return next(new appError('New passwords do not match', 400));
  }
  let hashedPassword = bcrypt.hashSync(newpassword, 8);
  user.password = hashedPassword;

  await user.save();

  createSendToken(user, 201, req, res);

  res
    .status(200)
    .json({ status: 'success', message: 'Password updated successfully' });
});

export const deleUser = catchAsync(async (req, res, next) => {
  let userid = req.params.id;
  if (!(req.user.role === 'admin' || req.user._id.toString() == userid)) {
    return next(
      new appError('You do not have permission to do this action.', 403)
    );
  }

  let user = await usermodel.findByIdAndDelete(userid);

  if (!user) {
    return next(new appError('User not found. dd', 404));
  }

  res.status(200).json({ status: 'success', message: 'User deleted' });
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new appError('You are not logged in! Please provide a token.', 401)
    );
  }

  let decoded = jwt.verify(token, process.env.SECRET);

  let theuser = await usermodel.findById(decoded.id);

  if (!theuser) {
    return next(new appError('the user not found', 404));
  }

  if (theuser.passwordChanged) {
    const passwordChangedTimestamp = parseInt(
      theuser.passwordChanged.getTime() / 1000,
      10
    );
    if (decoded.iat < passwordChangedTimestamp) {
      return next(
        new appError('Password changed recently. Please log in again.', 401)
      );
    }
  }
  res.locals.user = theuser; // for pug template

  req.user = theuser;

  next();
});
export const isLogedin = async (req, res, next) => {
  let token;
  if (req.cookies.jwt) {
    try {
      token = req.cookies.jwt;
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.SECRET
      );
      const theuser = await usermodel.findById(decoded.id);

      if (!theuser) {
        return next(new appError('the user not found', 404));
      }

      if (theuser.passwordChanged) {
        const passwordChangedTimestamp = parseInt(
          theuser.passwordChanged.getTime() / 1000,
          10
        );
        if (decoded.iat < passwordChangedTimestamp) {
          return next(
            new appError('Password changed recently. Please log in again.', 401)
          );
        }
      }

      res.locals.user = theuser; // for pug template

      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};

export const logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'

    if (!roles.includes(req.user.role)) {
      return next(
        new appError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};
