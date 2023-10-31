import React, { Fragment } from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from '../../axios/index';

const stripeBtn = () => {
  const publishableKey = "pk_test_51NfFraEGcRue3GUHmDGShja5f4ML32oLud8vLWGd2m6nEV8beUsUMb2UIGxwpgwun4BMWJEM41JzegaZHXTnEjzK00YRvykuo9";

  const onToken = token => {
    const body = {
      amount: 999,
      token: token
    };
    axios
      .post("/payment", body)
      .then(response => {
        console.log(response);
        alert("Payment Success");
      })
      .catch(error => {
        console.log("Payment Error: ", error);
        alert("Payment Error");
      });
  };
  return (
    <StripeCheckout
      label="Go Premium" //Component button text
      name="Business LLC" //Modal Header
      description="Upgrade to a premium account today."
      panelLabel="Payment" //Submit button in modal
      amount={999} //Amount in cents $9.99
      token={onToken}
      stripeKey={publishableKey}
      image="https://www.vidhub.co" //Pop-in header image
      billingAddress={false}
    />
  );
};
export default stripeBtn;