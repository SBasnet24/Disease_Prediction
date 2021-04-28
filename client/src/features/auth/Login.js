import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { login, clearErrors } from "./authSlice";
import Icon from "../../assets/Icon";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { errors, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  const history = useHistory();
  const dispatch = useDispatch();

  // If logged in and user navigates to Login page, should redirect them to dashboard
  useEffect(() => {
    if (isAuthenticated) history.push("/dashboard");
  }, [isAuthenticated]);

  const onSubmit = (e) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    dispatch(login(data));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-7">
          <Link
            to="/"
            onClick={() => dispatch(clearErrors())}
            className="login__a"
          >
            <i className="fas fa-arrow-left me-2"></i>Back to
            home
          </Link>
          <div className="mt-3">
            <h4>
              <b>Login</b> below
            </h4>
          </div>
          <form noValidate onSubmit={onSubmit}>
            <div className="input__group position-contact mt-4">
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                error={errors.auth}
                id="email"
                className="form-height form-control input__type__inner_login"
                required
              />
              <label htmlFor="email" className="label_position">Email</label>
              <span className="red-text">{errors.email}</span>
            </div>
            <div className="input__group position-contact mt-4">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                error={errors.auth}
                id="password"
                type="password"
                className="form-height form-control input__type__inner_login"
              required
              />
              <label htmlFor="password" className="label_position">Password</label>
              <span className="red-text">{errors.auth}</span>
            </div>
            <div className="mt-3">
              <button
                type="submit"
                className="btn btn-secondary text-uppercase btn__login"
                disabled={loading === "pending"}
              >
                {loading === "pending" ? (
                  <Icon name="spinner" />
                ) : (
                  <span>Login</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
