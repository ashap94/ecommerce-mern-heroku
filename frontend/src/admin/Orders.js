import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";
import { isAuthenticated } from "../auth";
import { formatMoney } from "../core/apiCore";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
        setLoading(false);
      } else {
        console.log("WHAT DO ORDERS LOOK LIKE:  ", data);
        setLoading(false);
        setOrders(data);
      }
    });
  };

  const loadStatusValues = () => {
    getStatusValues(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
  }, []);

  const showOrderLength = () => {
    if (orders.length > 0) {
      return <h1 className="text-danger">Total orders: {orders.length}</h1>;
    } else {
      if (loading) {
        return <h1 className="alert alert-light">Loading Orders...</h1>;
      } else {
        return <h1 className="text-danger">No Orders</h1>;
      }
    }
  };

  const showInput = (key, value) => {
    return (
      <div className="input-group mb-2">
        <div className="input-group-prepend">
          <div className="input-group-text">{key}</div>
        </div>
        <input type="text" value={value} className="form-control" readOnly />
      </div>
    );
  };

  const handleStatusChange = (orderId) => (e) => {
    let ordersState = orders.slice(0);
    console.log("STATUS CHANGE:  ", orderId, e.target.value);
    let status = e.target.value;
    updateOrderStatus(user._id, token, orderId, status).then((data) => {
      if (data.error) {
        setError(data.error);
        console.log("Status Update Error:  ", data.error);
      } else {
        replaceOrderStatus(ordersState, data);
        setOrders(ordersState);
      }
    });
  };

  const replaceOrderStatus = (orders, updatedOrder) => {
    const foundIndex = orders.findIndex(
      (order) => order._id === updatedOrder._id
    );
    return (orders[foundIndex] = updatedOrder);
  };

  const showStatus = (o) => {
    return (
      <div className="form-group">
        <h3 className="mark mb-4">Order Status: {o.status}</h3>
        <select className="form-control" onChange={handleStatusChange(o._id)}>
          <option>Update Status</option>
          {statusValues.map((status, sIndex) => {
            return (
              <option key={sIndex} value={status}>
                {status}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  return (
    <Layout
      title="Orders"
      description={`G'day ${user.name}, you can manage all the orders here.`}
      className="container-fluid"
    >
      <div className="row mb-4">
        <div className="col-md-8 offset-md-2">
          {showOrderLength()}

          {orders.map((o, oIndex) => {
            return (
              <div
                className="mt-5"
                style={{
                  borderBottom: "5px solid indigo",
                }}
                key={oIndex}
              >
                <h2 className="mb-5">
                  <span
                    className="bg-primary text-white"
                    style={{
                      borderRadius: "5px",
                    }}
                  >
                    Order ID: {o._id}
                  </span>
                </h2>

                <ul className="list-group">
                  <li className="list-group-item">{showStatus(o)}</li>
                  <li className="list-group-item">
                    Transaction ID: {o.transaction_id}
                  </li>
                  <li className="list-group-item">
                    Amount: ${formatMoney(o.amount)}
                  </li>
                  <li className="list-group-item">Ordered By: {o.user.name}</li>
                  <li className="list-group-item">
                    Ordered {moment(o.createdAt).fromNow()}
                    <br></br>
                    <br></br>
                    {moment(o.createdAt).format(
                      "dddd, MMMM Do YYYY, h:mm:ss a"
                    )}
                  </li>
                  <li className="list-group-item">
                    Delivery Address: {o.address}
                  </li>
                </ul>

                <h3 className="mt-5 mb-5 font-italic">
                  Total products in the order:{" "}
                  <span className="text-danger">{o.products.length}</span>
                </h3>

                {o.products.map((p, pIndex) => {
                  return (
                    <div
                      className="mb-4"
                      key={pIndex}
                      style={{ padding: "20px", border: "1px solid indigo" }}
                    >
                      {showInput("Product name", p.name)}
                      {showInput("Product price", p.price)}
                      {showInput("No. of items", p.count)}
                      {showInput("Product ID", p._id)}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
