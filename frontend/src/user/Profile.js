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
    error: false,
    success: false,
    passwordError: false,
  });

  const {
    name,
    email,
    password,
    password2,
    error,
    success,
    passwordError,
  } = values;
  const { token } = isAuthenticated();

  const init = (userId) => {
    read(userId, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: true });
      } else {
        setValues({ ...values, name: data.name, email: data.email });
      }
    });
  };

  useEffect(() => {
    init(props.match.params.userId);
  }, []);

  const handleChange = (field) => (e) => {
    setValues({
      ...values,
      error: false,
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
      };
    } else {
      userData = {
        name,
        email,
      };
    }

    update(props.match.params.userId, token, userData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: true });
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
      if (password === password2) {
        sendUpdateForm(1);
      } else {
        setValues({ ...values, passwordError: true });
      }
    } else {
      sendUpdateForm(0);
    }
  };

  const profileUpdate = (name, email, password) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={handleChange("name")}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={handleChange("email")}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">New Password (optional)</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={handleChange("password")}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Confirm New Password (optional)</label>
        <input
          type="password"
          className="form-control"
          value={password2}
          onChange={handleChange("password2")}
        />
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
      return <Redirect to="/user/dashboard" />;
    }
  };

  const showErrors = (error) =>
    error && (
      <div className="alert alert-danger">Error due to invalid credentials</div>
    );

  const showPasswordError = (passwordError) =>
    passwordError && (
      <div className="alert alert-danger">Passwords confirmation error</div>
    );

  return (
    <Layout
      title={`Profile`}
      description="Update your profile"
      className="container-fluid mb-5"
    >
      <h2 className="mb-4">Profile Update</h2>
      {showErrors(error)}
      {showPasswordError(passwordError)}
      {showSuccess(success)}
      {redirectUponSuccess(success)}
      {profileUpdate(name, email, password)}
    </Layout>
  );
};

export default Profile;
