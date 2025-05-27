import mongoose from 'mongoose';
import Tour from './TourModel.js';

const reviewsSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review is required'],
    },
    rating: {
      type: Number,
      required: [true, 'rating is required'],
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// avg rating
reviewsSchema.statics.calcAverageRatings = async function (tourId) {
  const state = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (state.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: state[0].nRating,
      ratingsAverage: state[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};


// before excute(findOneAnd-findOneAndUpdate-findOneAndDelete)
reviewsSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.model.findOne(this.getQuery());
  next();
});

// after excute findOneAnd
reviewsSchema.post(/^findOneAnd/, async function () {
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.tour); 
  }
});

// after save 
reviewsSchema.post('save', async function () {
  await this.constructor.calcAverageRatings(this.tour); 
});

reviewsSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'userID',
  //   select:
  //     '-__v -updatedAt -createdAt -comfirmEmail -password -_id -passwordResetToken -passwordResetTokenExpire',
  // }).populate({
  //   path: 'tourID',
  //   select: '-description',
  // });
  
  this.populate({
    path: 'user',
    select:
      'photo name',
  });
  next();
});

reviewsSchema.index({ tour: 1, user: 1 }, { unique: true });
const Review = mongoose.model('Review', reviewsSchema);
export default Review;
