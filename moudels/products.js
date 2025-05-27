import mongoose from 'mongoose';

const productsscema = new mongoose.Schema(
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
    role: {
      type: String,
      enum: Object.values(roleType),
      default: 'user',
    },
  },
  { timestamps: true }
);

const productsModel = mongoose.model('products', productsscema);

export default productsModel;
