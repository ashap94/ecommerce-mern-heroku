import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import { read, update, updateUserLocalStorage } from "./apiUser";

const Profile = (props) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    oldPassword: "",
    error: "",
    success: false,
    passwordError: "",
    loading: true,
  });

  const {
    name,
    email,
    password,
    password2,
    error,
    success,
    passwordError,
    oldPassword,
    loading,
  } = values;
  const { token } = isAuthenticated();

  const init = (userId) => {
    read(userId, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          name: data.name,
          email: data.email,
          loading: false,
        });
      }
    });
  };

  useEffect(() => {
    init(props.match.params.userId);
  }, []);

  const handleChange = (field) => (e) => {
    setValues({
      ...values,
      error: "",
      [field]: e.target.value,
      passwordError: false,
    });
  };

  const sendUpdateForm = (bool) => {
    // bool signifies if password passed in to the api for modification of user document
    let userData;
    if (bool) {
      userData = {
        name,
        email,
        password,
        oldPassword,
      };
    } else {
      if (!!oldPassword) {
        setValues({
          ...values,
          error: "Please clear 'Old Password' field if not updating password",
        });
        return;
      }
      userData = {
        name,
        email,
      };
    }

    update(props.match.params.userId, token, userData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        updateUserLocalStorage(data, () => {
          setValues({ ...values, success: true });
        });
      }
    });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    if (password || password2) {
      if (password === password2 && oldPassword) {
        sendUpdateForm(1);
      } else {
        setValues({ ...values, passwordError: true });
      }
    } else {
      sendUpdateForm(0);
    }
  };

  const profileUpdate = (name, email, password) => (
    <form style={{ display: loading ? "none" : "" }}>
      <h2>Basic Info</h2>
      <div
        style={{ border: "2px solid #eee", borderRadius: "5px" }}
        className="p-4 mt-3 mb-3"
      >
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={handleChange("name")}
            maxLength="50"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={handleChange("email")}
            maxLength="60"
          />
        </div>
      </div>
      <h2>Password</h2>
      <div
        style={{ border: "2px solid #eee", borderRadius: "5px" }}
        className="p-4 mt-3 mb-3"
      >
        <div className="form-group">
          <label className="text-muted">Old Password</label>
          <input
            type="password"
            className="form-control"
            value={oldPassword}
            onChange={handleChange("oldPassword")}
            maxLength="30"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">New Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={handleChange("password")}
            maxLength="30"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            value={password2}
            onChange={handleChange("password2")}
            maxLength="30"
          />
        </div>
      </div>
      <button onClick={clickSubmit} className="btn btn-primary">
        Update
      </button>
    </form>
  );

  const showSuccess = (success) =>
    success && (
      <div className="alert alert-success">
        This is a success alert—check it out!
      </div>
    );

  const redirectUponSuccess = (success) => {
    if (success) {
      return (
        <Redirect
          to={{
            pathname: "/user/dashboard",
            state: {
              successfulUpdate: true,
            },
          }}
        />
      );
    }
  };

  const showErrors = (error) =>
    error && <div className="alert alert-danger">{error}</div>;

  const showPasswordError = (passwordError) =>
    passwordError && (
      <div className="alert alert-danger">Passwords confirmation error</div>
    );

  const showLoading = (loading) =>
    loading && <h3 className="text-muted">Loading User Details...</h3>;

  return (
    <Layout
      title={`Profile`}
      description="Update your profile"
      className="container-fluid mb-5"
    >
      {/* <h2 className="mb-4">Profile Update</h2> */}
      {showLoading(loading)}
      {showErrors(error)}
      {showPasswordError(passwordError)}
      {showSuccess(success)}
      {redirectUponSuccess(success)}
      {profileUpdate(name, email, password)}
    </Layout>
  );
};

export default Profile;
