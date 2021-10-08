import { PayPalButton } from "react-paypal-button-v2";
import React from "react";
export default class PaypalButton extends React.Component {
  render() {
    let total = this.props.total;
    return (
      <PayPalButton
        amount={total}
        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
        onSuccess={(payment) => {
          this.props.tranSuccess(payment);

          // OPTIONAL: Call your server to save the transaction
        }}
        options={{
          clientId:
            "ASf__t89jZTu0GM_cGJEvWY4mX5gKaTutHQFjp_6_Z-vZM2KoQ3gKpMACnoLbomn-snmHxJX7YXJi8VW",
        }}
      />
    );
  }
}
