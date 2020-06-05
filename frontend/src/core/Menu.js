import React, { Fragment, useEffect, useState, useRef } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/index";
import { itemTotal } from "./cartHelpers";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

const Menu = ({ history, menuRef }) => {
  const [loaded, setLoaded] = useState(false);
  const cartBadgeRef = useRef(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const { current } = cartBadgeRef;

    let height = current.offsetHeight;
    let width = current.offsetWidth;

    if (height > width) {
      current.style.width = height + "px";
    } else if (height < width) {
      current.style.height = width + "px";
    }
  }, [loaded]);

  /*
  
        style={{ borderBottom: "1px solid #007bff" }}
  
  */

  return (
    <div className="menu-bar" ref={menuRef}>
      <ul
        className="nav nav-tabs bg-primary"
        style={{ borderBottom: "1px solid #007bff" }}
      >
        <li className="nav-item">
          <Link className="nav-link" to="/" style={isActive(history, "/")}>
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            to="/shop"
            style={isActive(history, "/shop")}
          >
            Shop
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            to="/cart"
            style={isActive(history, "/cart")}
          >
            Cart{" "}
            <sup id="cart-badge" ref={cartBadgeRef}>
              {itemTotal()}
            </sup>
          </Link>
        </li>

        {isAuthenticated() && isAuthenticated().user.role === 0 && (
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/user/dashboard"
              style={isActive(history, "/user/dashboard")}
            >
              Dashboard
            </Link>
          </li>
        )}

        {isAuthenticated() && isAuthenticated().user.role === 1 && (
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/admin/dashboard"
              style={isActive(history, "/admin/dashboard")}
            >
              Dashboard
            </Link>
          </li>
        )}

        {!isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signin")}
                to="/signin"
              >
                Signin
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signup")}
                to="/signup"
              >
                Signup
              </Link>
            </li>
          </Fragment>
        )}

        {isAuthenticated() && (
          <li className="nav-item">
            <span
              className="nav-link"
              style={{ cursor: "pointer", color: "#ffffff" }}
              onClick={() =>
                signout(() => {
                  history.push("/");
                })
              }
            >
              Signout
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default withRouter(Menu);
