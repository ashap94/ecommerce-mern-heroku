import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "./Layout";
import Card from "./Card";
import { getCart } from "./cartHelpers";

const Cart = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const showItems = (items) => {
    return (
      <div>
        <h2>Your cart has {`${items.length}`} items</h2>
        <hr></hr>
        {items.map((p, i) => {
          return (
            <Card
              product={p}
              key={i}
              showAddToCartButton={false}
              cartUpdate={true}
            />
          );
        })}
      </div>
    );
  };

  const noItemsMessage = () => {
    return (
      <h2>
        Your cart has no items. <br /> <Link to="/shop">Continue Shopping</Link>
      </h2>
    );
  };

  return (
    <Layout
      title="Shopping Page"
      description="Manage your cart items. Add, remove, checkout or continue shopping."
      className="container-fluid"
    >
      <div className="row">
        <div className="col-6">
          {items.length > 0 ? showItems(items) : noItemsMessage()}
        </div>

        <div className="col-6">
          show checkout options/shipping address/total/update quantity
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
