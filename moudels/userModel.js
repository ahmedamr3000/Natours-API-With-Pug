import mongoose from 'mongoose';
import crypto from 'crypto';

const roleType = {
  user: 'user',
  admin: 'admin',
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      required: [true, 'This field is required'],
    },
    email: {
      type: String,
      required: [true, 'This field is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    phone: String,
    comfirmEmail: {
      type: Boolean,
      default: false,
    },

    gender: {
      type: String,
      enum: ['male', 'female'],
      default: 'male',
    },
    photo: { type: String, required: false },
    active: { type: Boolean, default: true },
    role: {
      type: String,
      enum: Object.values(roleType),
      default: 'user',
    },
    passwordChanged: Date,
    passwordResetToken: String,
    passwordResetTokenExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const usermodel = mongoose.model('User', userSchema);

export default usermodel;
