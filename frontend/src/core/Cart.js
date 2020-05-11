import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "./Layout";
import Card from "./Card";
import { getCart } from "./cartHelpers";
import Checkout from "./Checkout";

function useAsyncState(initialValue) {
  const [value, setValue] = useState(initialValue);
  const setter = (x) =>
    new Promise((resolve) => {
      setValue(x);
      resolve(x);
    });
  return [value, setter];
}

const Cart = () => {
  const [items, setItems] = useAsyncState([]);
  const [run, setRun] = useState(false);
  const [itemCounts, setItemCounts] = useState([]);

  useEffect(() => {
    setItems(getCart());
  }, [run]);

  const showItems = (items) => {
    return (
      <div>
        <h2>Your cart has {`${items.length}`} items</h2>
        <hr></hr>
        {items.map((p, i) => {
          return (
            <div className="mb-4">
              <Card
                product={p}
                key={i}
                showAddToCartButton={false}
                cartUpdate={true}
                showRemoveItemButton={true}
                run={run}
                setRun={setRun}
              />
            </div>
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
          <h2 className="mb-4">Your cart summary</h2>
          <hr></hr>
          <Checkout products={items} />
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
