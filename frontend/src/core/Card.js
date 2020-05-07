import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import moment from "moment";
import { addItem } from "./cartHelpers";

const Card = ({
  product,
  showViewProductButton = true,
  limitDescription = true,
  showAddToCartButton = true,
  cartUpdate = false,
}) => {
  const [redirect, setRedirect] = useState(false);

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

  const showCartUpdateOptions = (cartUpdate) => {
    return cartUpdate && <div>increment/decrement</div>;
  };

  return (
    <div className="card">
      <div className="card-header name">{product.name}</div>
      <div className="card-body">
        {shouldRedirect(redirect)}

        <ShowImage item={product} url="product" />
        {showDescription()}
        <p className="black-10">${product.price}</p>
        <p className="black-9">
          Category: {product.category && product.category.name}
        </p>
        <p className="black-8">Added {moment(product.createdAt).fromNow()}</p>

        {showStock(product.quantity)}
        <br></br>

        {showViewButton()}

        {showAddToCart(showAddToCartButton)}
        {showCartUpdateOptions(cartUpdate)}
      </div>
    </div>
  );
};

export default Card;
