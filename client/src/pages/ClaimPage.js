import React, { useState } from "react";
import axios from "axios";

const ClaimPage = () => {
  const [coupon, setCoupon] = useState(null);
  const [message, setMessage] = useState("");

  const claimCoupon = async () => {
    try {
      const res = await axios.post("https://coupon-distribution-020j.onrender.com/coupons/claim");
      setCoupon(res.data.coupon);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div className="main-container">
    <div className="container">
      <h1>Claim your Coupon</h1>
      <button className="claim-button" onClick={claimCoupon}>Claim Coupon</button>
      {message && <p>{message}</p>}
      {coupon && <p>🎉 Your Coupon Code: <b>{coupon}</b></p>}
    </div>
    </div>
  );
};

export default ClaimPage;
