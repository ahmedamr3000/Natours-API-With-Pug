import mongoose, { Types } from 'mongoose';
import fs from 'fs';
import Review from './moudels/reviews.js';
import 'dotenv/config';
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    // console.log('mongo is conected');
  })
  .catch((err) => console.log('dataBase Error'));

const importData = async () => {
  try {
    const reviews = JSON.parse(fs.readFileSync('./reviews.json', 'utf-8'));

    const transformedReviews = reviews.map((r) => ({
      ...r,
      user: new Types.ObjectId(r.user),
      tour: new Types.ObjectId(r.tour),
    }));

    await Review.insertMany(transformedReviews);
    process.exit();
  } catch (err) {
    console.error('❌ Error loading data:', err);
    process.exit(1);
  }
};

importData();
