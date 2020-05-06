import React, { useState, useEffect } from "react";
import { getProduct } from "./apiCore";
import Layout from "./Layout";
import Card from "./Card";

const Product = ({ match }) => {
  const [product, setProduct] = useState({});
  const [error, setError] = useState(false);

  const loadSingleProduct = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setError(error);
      } else {
        setProduct(data);
      }
    });
  };

  useEffect(() => {
    let productId = match.params.productId;
    loadSingleProduct(productId);
  }, []);

  //   const loadError = () => (
  //       error &&
  //   )

  return (
    <Layout
      title={product && product.name}
      description={
        product && product.description && product.description.substring(0, 80)
      }
      className="container-fluid"
    >
      <div className="row">
        <div className="col-8 mb-3">
          {product && product.description && (
            <Card product={product} showViewProductButton={false} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Product;
