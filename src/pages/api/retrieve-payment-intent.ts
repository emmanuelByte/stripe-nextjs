import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const paymentIntentId = req.query.paymentIntentId as string;

  try {
    const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);

    res.status(200).json({ paymentIntent });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Error creating payment intent' });
  }
}
