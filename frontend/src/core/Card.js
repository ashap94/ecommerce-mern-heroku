import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import moment from "moment";
import { addItem, updateItem, deleteItem } from "./cartHelpers";
import { formatMoney } from "./apiCore";

const Card = ({
  product,
  showViewProductButton = true,
  limitDescription = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveItemButton = false,
  setRun = (f) => f,
  run = undefined,
  listPage = false,
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  // useEffect(() => {
  //   console.log("PRODUCT CATEGORY IS OF TYPE:  ", typeof product.category);
  // }, []);

  const showViewButton = () => {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`}>
          <button className="btn btn-outline-primary mt-2 mb-2 mr-2">
            View Product
          </button>
        </Link>
      )
    );
  };

  const showDescription = () => {
    return limitDescription ? (
      product.description.length <= 25 ? (
        <p className="lead mt-2">{product.description}</p>
      ) : (
        <p className="lead mt-2">{product.description.substring(0, 25)}...</p>
      )
    ) : (
      <p className="lead mt-2">{product.description}</p>
    );
  };

  const addToCart = () => {
    addItem(product, () => {
      setRedirect(true);
    });
  };

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showAddToCart = (showAddToCartButton) => {
    return (
      showAddToCartButton && (
        <button
          onClick={addToCart}
          className="btn btn-outline-warning mt-2 mb-2"
        >
          Add to Cart
        </button>
      )
    );
  };

  const showStock = (quantity) => {
    return quantity > 0 ? (
      <span className="badge badge-pill badge-primary">In Stock</span>
    ) : (
      <span className="badge badge-pill badge-danger">Out of Stock</span>
    );
  };

  const handleChange = (productId) => (e) => {
    setCount(e.target.value < 1 ? 1 : e.target.value);
    if (e.target.value >= 1) {
      updateItem(productId, e.target.value);
    }
    setRun(!run);
  };

  const showCartUpdateOptions = (cartUpdate) => {
    return (
      cartUpdate && (
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Adjust Quantity</span>
          </div>
          <input
            type="number"
            className="form-control"
            value={product.count}
            onChange={handleChange(product._id)}
          />
        </div>
      )
    );
  };

  const showRemoveButton = (showRemoveItemButton) => {
    return (
      showRemoveItemButton && (
        <button
          className="btn btn-outline-danger"
          onClick={() => {
            deleteItem(product._id);
            setRun(!run);
            // setCount(product.count);
          }}
        >
          Remove Item
        </button>
      )
    );
  };

  const displayCategoryName = (product) => {
    if (typeof product.category === "object") {
      return product.category.name;
    } else {
      return product.category;
    }
  };

  return (
    <div className="card flex-fill">
      <div className="card-header name">{product.name}</div>
      <div className="card-body">
        {shouldRedirect(redirect)}

        <ShowImage item={product} url="product" />
        {showDescription()}
        <p className="black-10">${formatMoney(product.price)}</p>
        <p className="black-10">
          Category: {product.category && displayCategoryName(product)}
        </p>
        <p className="black-10">Added {moment(product.createdAt).fromNow()}</p>

        {showStock(product.quantity)}
        <br></br>

        {showViewButton()}
        {showRemoveButton(showRemoveItemButton)}

        {showAddToCart(showAddToCartButton)}
        {showCartUpdateOptions(cartUpdate)}
      </div>
    </div>
  );
};

export default Card;
