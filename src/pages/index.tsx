import { ChangeEvent, useState } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Home() {
  const [amount, setAmount] = useState<number>(100);
  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log('sending...');
    const response = await fetch(
      'http://localhost:8000/v1/api/payment/create',
      {
        method: 'POST',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmNkZThhMGRlZTI2ZmIxZTU0YmEwOCIsImVtYWlsIjoiZW1hbnVlbG1lY2hpZUBnbWFpbC5jb20iLCJpYXQiOjE2Nzk0OTgxMDEsImV4cCI6MTcxMTAzNDEwMX0.HDLtK0vssQzBq5plqoFM3bDoK68P_-fp_nwuwTqT21Y',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100,
          paymentMethod: 'CARD',
        }),
      }
    );

    const { data } = await response.json();
    console.log({ data });
    const { clientSecret } = data;
    const result = await stripe?.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements?.getElement(CardElement)!,
      },
    });

    if (result?.error) {
      console.error(result.error.message);
    } else {
      console.log(result?.paymentIntent);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {};

  return (
    <div className="container">
      <h1 className="heading">Stripe Payment Form</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="amount">
          Amount (in cents)
        </label>
        <input
          className="form-input"
          id="amount"
          type="number"
          value={amount}
          onChange={handleChange}
        />

        <label className="form-label" htmlFor="card-element">
          Card Information
        </label>
        <div className="card-element">
          <CardElement
            options={{ style: { base: { fontSize: '16px' } } }}
            className="card-input"
          />
        </div>

        <button className="btn" type="submit">
          Pay
        </button>
      </form>
    </div>
  );
}
