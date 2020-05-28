import React from "react";
import { API } from "../config";
import { Link } from "react-router-dom";

const ShowListItemImage = ({ item }) => {
  return (
    <Link to={`/product/${item._id}`} className="mr-3">
      <img
        src={`${API}/product/photo/${item._id}`}
        alt={item.name}
        style={{ height: "90px", width: "90px", objectFit: "contain" }}
      />
    </Link>
  );
};

export default ShowListItemImage;
