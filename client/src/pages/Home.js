import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container">
        <div className="container">
        <div className="box">
            <h1>Welcome to Coupon Distributor</h1>
            <div className="button-group">
            <button onClick={() => navigate("/claim")} className="user-button">User</button>
            <button onClick={() => navigate("/admin-login")} className="admin-button">Admin</button>
            </div>
        </div>
        </div>
    </div>
  );
};


export default Home;
