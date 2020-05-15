import React, { useState, useEffect } from "react";
// import Layout from "./Layout";
import {
  getProducts,
  formatMoney,
  getBraintreeClientToken,
  processPayment,
} from "./apiCore";
import { emptyCart } from "./cartHelpers";
// import Card from "./Card";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";

const Checkout = ({ products, setItems }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: "",
  });

  const { success, clientToken, error, instance, address, loading } = data;

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then((data) => {
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        setData({ clientToken: data.clientToken });
      }
    });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const calculateCost = () => {
    return products.reduce((accum, product) => {
      return accum + product.price * product.count;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sign in to checkout</button>
      </Link>
    );
  };

  const buy = () => {
    setData({ ...data, loading: true });
    // send the nonce to your server
    // nonce = data.instance.requestPaymentMethod()
    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then((data) => {
        // console.log(data);
        nonce = data.nonce;
        // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
        // and also total to be charged
        // console.log(
        //   "send nonce and total to process: ",
        //   nonce,
        //   calculateCost()
        // );
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: calculateCost(products),
        };
        processPayment(userId, token, paymentData)
          .then((response) => {
            console.log("SHOWING RESPONSE AFTER PAYMENT PROCESS:  ", response);

            // empty cart
            emptyCart(() => {
              setItems([]);
              setData({ ...data, success: response.success, loading: false });
            });
            // create order
          })
          .catch((err) => {
            console.log("SHOWING ERROR AFTER PAYMENT PROCESS:  ", err);
            setData({ ...data, error: err, loading: false });
          });
      })
      .catch((err) => {
        console.log("dropin error: ", err);
        setData({ ...data, error: err.message, loading: false });
      });
  };

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: "vault",
              },
            }}
            onInstance={(instance) => (data.instance = instance)}
          />
          <button onClick={buy} className="btn btn-success">
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  const showError = (error) => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = (success) => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      Thank you! Your payment was successfully processed!
    </div>
  );

  const showLoading = (loading) =>
    loading && <h2 className="alert alert-light">Loading...</h2>;

  return (
    <div>
      <h2>Total: ${formatMoney(calculateCost())}</h2>
      {showLoading(loading)}
      {showSuccess(success)}
      {showError(error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
