import * as dotenv from 'dotenv';
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51RFDEfRdMue92g2CRso3lSyBjdt5AdIwT8hOA40Ry57JpGI1g6y92MQ3vez9SJ7y8fNxpoPp0GHSyVZFdVYVIPYG00vapvAKLo'
);

const bokking = document.getElementById('book');

export const bookTour = async (tourId) => {
  try {
    console.log('hi');

    const session = await axios.get(
      `http://localhost:4200/api/booking/checkout/${tourId}`
    );
    bokking.textContent = 'Book tour now!';

    console.log(session.data.session);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    showAlert('error', error);
  }
};
