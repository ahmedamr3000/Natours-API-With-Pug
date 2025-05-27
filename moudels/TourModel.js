import mongoose from 'mongoose';
// import usermodel from './userModel.js';
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      min: 4,
      unique: true,
    },

    duration: {
      type: Number,
      require: true,
    },
    maxGroupSize: {
      type: Number,
      require: true,
    },
    difficulty: {
      type: String,
      require: true,
      min: 4,
    },

    ratingsAverage: {
      type: Number,
      require: true,
      default: 2,
      set: (val) => Math.round(val * 10) / 10, // if val = 3.66
    },
    ratingsQuantity: {
      type: Number,
      require: true,
      default: 5,
    },
    price: {
      type: Number,
      require: true,
      min: 3,
    },
    summary: {
      type: String,
      require: true,
      min: 10,
    },
    description: {
      type: String,
      require: true,
      min: 10,
    },
    imageCover: {
      type: String,
      require: true,
    },
    // startLocation: {
    //   type: {
    //     type: String,
    //     default: 'Point',
    //     enum: ['Point'],
    //   },
    //   coordinates: [Number],
    //   address: String,
    //   description: String,
    // },
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        discription: String,
        date: Number,
      },
    ],
    images: {
      type: [String],
      validate: [arrayLimit, 'You can upload up to 4 images only'],
    },
    startDates: [Date],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

function arrayLimit(val) {
  return val.length <= 4;
}
// put guides static in Tour
// tourSchema.pre('save', async function (next) {
//   console.log(this.guides + 'dd');

//   const guidesData = this.guides.map(
//     async (id) => await usermodel.findById(id)
//   );
//   this.guides = await Promise.all(guidesData);
//   next();
// });

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: 'name email photo active role',
  }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
