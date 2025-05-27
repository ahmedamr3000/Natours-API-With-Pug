import { catchAsync } from '../../units/catchSync.js';
import appError from '../../Error/appError.js';
import Tour from '../../moudels/TourModel.js';
import Stripe from 'stripe';
import booking from '../../moudels/booking.js';

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tours = await Tour.findById(req.params.id);
  if (!tours) {
    return next(new appError('No tour found with that ID', 404));
  }
  console.log();

  const stripe = new Stripe(process.env.STRIPE);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/api/booking/checkout/${
      req.params.id
    }?tour=${req.params.id}&user=${req.user.id}&price=${tours.price}`,

    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tours._id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tours.name} Tour`,
            description: tours.summary,
            images: [`https://natours.dev/img/tours/${tours.imageCover}`],
          },
          unit_amount: tours.price * 100,
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

export const createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is temporary, because it's unsecure: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await booking.create({ tour, user, price });

  res.redirect(`${req.protocol}://${req.get('host')}/api/template/${tour}`);
});
