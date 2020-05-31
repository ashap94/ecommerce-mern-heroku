import React, { useState, useEffect } from "react";
// import Layout from "./Layout";
import {
  getProducts,
  formatMoney,
  getBraintreeClientToken,
  processPayment,
  createOrder,
} from "./apiCore";
import { emptyCart } from "./cartHelpers";
// import Card from "./Card";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
// import { country_list } from "./List_of_Countries";
import { USStates } from "./List_of_US_States";

const Checkout = ({ products, setItems, shipping = false }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const {
    success,
    clientToken,
    error,
    instance,
    address,
    address2,
    city,
    state,
    zipCodem,
    loading,
    zipCode,
  } = data;

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

  // const findIfProductsHaveShipping = (products) => {
  //   if (products.some((product) => product.shipping === true)) {
  //     setData({ ...data, shipping: true });
  //   } else {
  //     setData({ ...data, shipping: false });
  //   }

  /* 
    - if shipping is true, allow input fields to be editable
    - if false, make input fields disabled and/or display message that shipping is not required
    - need to make api function call not allowed to be sent if user does not fill in fields 
      of address fields 
    - should implement error handling for both client side and server side if address field not
      filled out
      - server side error handling should be implmented if user somehow manages to send api request
        without interaction from the client UI
    */
  // };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  // useEffect(() => {
  //   console.log("Address:  ", JSON.stringify(address));
  // }, [address]);

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

            // create order

            // create aggregated address object from all address input field data
            // const addressObject = {
            //   street1: address,
            //   street2: address2,
            //   city: city,
            //   state
            // }

            const createOrderData = {
              products: products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount,
              address: address,
            };

            createOrder(userId, token, createOrderData);

            // empty cart
            emptyCart(() => {
              setItems([]);
              setData({ ...data, success: response.success, loading: false });
            });
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

  const handleAddressField = (field) => (e) => {
    setData({ ...data, [field]: e.target.value });
  };

  // const handleZipCodeChange = (e) => {
  //   if (e.target.value.match("[0-9]{5}") != null) {
  //     setData({
  //       ...data,
  //       zipCode: e.target.value,
  //     });
  //   }

  // /*
  //     zip+4 regex:
  //       pattern="^\s*?\d{5}(?:[-\s]\d{4})?\s*?$"

  //     regular zip regex:
  //       [0-9]{5}

  //    */
  // };

  /* 
    ^^^^^^ 
    couldn't be utilized b/c input field would not accept 
    a string of greater length than five, apply regex checking in backend
  */

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <form
            style={{
              border: "3px solid rgb(247,247,249)",
              borderRadius: "5px",
            }}
            className="p-3 mb-2"
          >
            <label>
              Shipping Address{" "}
              <span
                style={{ display: shipping ? "none" : "" }}
                className="text-muted"
              >
                (not required, no physical items in cart)
              </span>
            </label>
            <div className="form-group">
              <label className="text-muted">Address</label>
              <input
                type="text"
                className="form-control"
                onChange={handleAddressField("address")}
                value={address}
                placeholder="1234 Main St"
                disabled={shipping ? false : true}
              />
            </div>
            <div className="form-group">
              <label className="text-muted">Address 2 (optional)</label>
              <input
                type="text"
                className="form-control"
                onChange={handleAddressField("address2")}
                value={address2}
                placeholder="Apartment, studio, or floor"
                disabled={shipping ? false : true}
              />
            </div>
            <div className="form-row">
              <div className="form-group col-md-5">
                <label className="text-muted">City</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={handleAddressField("city")}
                  value={city}
                  disabled={shipping ? false : true}
                />
              </div>
              <div className="form-group col-md-4">
                <label className="text-muted">State</label>
                <select
                  className="form-control"
                  onChange={handleAddressField("state")}
                  value={state}
                  disabled={shipping ? false : true}
                >
                  <option className="text-muted">Choose...</option>
                  {USStates.map((state, i) => (
                    <option key={i} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-3">
                <label className="text-muted">Zip</label>
                <input
                  type="text"
                  maxLength="10"
                  className="form-control"
                  onChange={handleAddressField("zipCode")}
                  value={zipCode}
                  disabled={shipping ? false : true}
                />
              </div>
            </div>
          </form>

          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: "vault",
              },
            }}
            onInstance={(instance) => (data.instance = instance)}
          />
          <div className="d-flex justify-content-center">
            <button
              onClick={buy}
              className="btn btn-success"
              style={{ width: "95%" }}
            >
              Pay
            </button>
          </div>
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
