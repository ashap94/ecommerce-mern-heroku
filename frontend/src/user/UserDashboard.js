import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getUserPurchaseHistory, update } from "./apiUser";
import moment from "moment";
import { formatMoney } from "../core/apiCore";
import ShowListItemImage from "./ShowListItemImage";

const Dashboard = (props) => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(false);
  const [modalDisplay, setModalDisplay] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  const token = isAuthenticated().token;

  const init = () => {
    getUserPurchaseHistory(_id, token).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setHistory(data);
      }
    });
  };

  // successfulUpdate

  useEffect(() => {
    if (props.location.state && props.location.state.successfulUpdate) {
      setUpdateSuccess(true);
    }

    init();
  }, []);

  // useEffect(() => {
  //   console.log("HERE IS WHAT HISTORY LOOKS LIKE:  ", history);
  // }, [history]);

  const userLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">User Links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/cart">
              My Cart
            </Link>
          </li>

          <li className="list-group-item">
            <Link className="nav-link" to={`/profile/${_id}`}>
              Update Profile
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const userInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">User Information</h3>
        <ul className="list-group">
          <li className="list-group-item">{name}</li>
          <li className="list-group-item">{email}</li>
          <li className="list-group-item">
            {role === 1 ? "Admin" : "Registered User"}
          </li>
        </ul>
      </div>
    );
  };

  const changeModalDisplay = () => {
    setModalDisplay(!modalDisplay);
  };

  const addressObjectToStringParser = (addressObject) => {
    return `${addressObject.name}\n${
      addressObject.company ? addressObject.company + "\n" : ""
    }${addressObject.street1}\n${
      addressObject.street2 ? addressObject.street2 + "\n" : ""
    }${addressObject.city} ${addressObject.state} ${addressObject.zip}`;
  };

  const purchaseHistory = (history) => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">Purchase History</h3>
        <ul className="list-group" style={{ borderRadius: "5px" }}>
          {history.map((order, oIndex) => {
            return (
              <li className="list-group-item" key={order._id + `${oIndex}`}>
                <div
                  className="d-flex flex-row justify-content-between p-3"
                  style={{ backgroundColor: "rgb(246,246,246)" }}
                >
                  <div className="d-flex flex-row">
                    <div className="d-flex flex-column mr-4">
                      <div className="font-weight-light">ORDER PLACED</div>
                      <div className="font-weight-light">
                        {moment(order.createdAt).format("MMM D, YYYY")}
                      </div>
                    </div>

                    <div className="d-flex flex-column mr-1">
                      <div className="font-weight-light">TOTAL</div>
                      <div className="font-weight-light">
                        ${formatMoney(order.amount)}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column">
                    <div>SHIP TO</div>
                    {order.address ? (
                      <div className="name-address-modal-container">
                        <span className="order-recipient-name">
                          {order.address.name}
                        </span>
                        <div className="p-3 address-modal hidden">
                          {addressObjectToStringParser(order.address)}
                        </div>
                      </div>
                    ) : (
                      <div className="name-address-modal-container">
                        <span className="order-recipient-name">{name}</span>
                        <div className="p-3 address-modal hidden">
                          Delivery Address Not Required
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="d-flex flex-column">
                    <div className="font-weight-light">ORDER ID</div>
                    <div className="font-weight-light">{order._id}</div>
                  </div>
                </div>
                {order.products.map((product, pIndex) => {
                  return (
                    <div
                      className="d-flex flex-row mt-4"
                      key={pIndex + `${product._id}`}
                    >
                      <ShowListItemImage item={product} />

                      <div className="d-flex flex-column">
                        <Link
                          to={`/product/${product._id}`}
                          className="text-info"
                        >
                          {product.name}
                        </Link>

                        <div className="font-weight-light">
                          Quantity: {product.count}
                        </div>

                        <div className="font-weight-light">
                          Price per unit: ${formatMoney(product.price)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const showUpdateSuccess = (updateSuccess) =>
    updateSuccess && (
      <div className="alert alert-success">
        Account information updated successful.
      </div>
    );

  return (
    <Layout
      title="Dashboard"
      description={`G'day ${name}!`}
      className="container-fluid"
    >
      {showUpdateSuccess(updateSuccess)}
      <div className="row">
        <div className="col-md-3 mb-5">{userLinks()}</div>
        <div className="col-md-9">
          {userInfo()}
          {purchaseHistory(history)}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
