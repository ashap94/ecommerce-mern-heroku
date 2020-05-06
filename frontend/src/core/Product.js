import React, { useState, useEffect } from "react";
import { getProduct, listRelated } from "./apiCore";
import Layout from "./Layout";
import Card from "./Card";

const Product = (props) => {
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [error, setError] = useState(false);

  const loadSingleProduct = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setError(error);
      } else {
        setProduct(data);
        listRelated(data._id).then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setRelatedProducts(data);
          }
        });
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    let productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, [props]);

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
            <Card
              product={product}
              showViewProductButton={false}
              limitDescription={false}
            />
          )}
        </div>
        <div className="col-4 mb-3">
          <h4>Related Products</h4>
          {relatedProducts.map((product, i) => (
            <div className="mb-3">
              <Card key={i} product={product} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Product;
