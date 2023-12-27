/* eslint-disable*/
const { default: Stripe } = require('stripe');
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51OQotfSBx4J8U6yUr73UQ02un0nJl66e04UruPGBpHw8sOlKYZ2XPGUj9Acn7XF1TFLQJixgpunVavm82iOB5AIF00rQrZIRIy',
);

export const bookTour = async (tourId) => {
  try {
    //1) Get checkout session from API
    // console.log(tourId);
    // const session = await axios(
    //   `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`,
    // );
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    //2) Create checkout form + charge the credit card
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    // });
    window.location.replace(session.data.session.url);
  } catch (err) {
    // console.log(err);
    showAlert('error', err);
  }
};
