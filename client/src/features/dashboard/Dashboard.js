import React, { Component } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../auth/authSlice";

const Dashboard = () => {
  // Get user from state
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const onLogoutClick = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
  };

  return (
    <div style={{ height: "75vh" }} className="container valign-wrapper">
      <div className="row">
        <div className="landing-copy col s12 center-align">
          <h4>
            <b>Hey there,</b> {user.name.split(' ')[0]}
          </h4>
          <button
            style={{
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "1rem",
            }}
            onClick={onLogoutClick}
            className="btn btn-secondary text-uppercase btn__login"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
