import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const stripe = new Stripe(stripeSecretKey, {
  // Use a generic recent API version, you might want to pin this to the exact version used in your Stripe dashboard
  apiVersion: '2023-10-16', 
  appInfo: {
    name: 'Course Registration App',
    version: '0.1.0',
  },
});
