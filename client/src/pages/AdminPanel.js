import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './AdminPanel.css'; // Importing the CSS file for styling

// Admin Panel Component
const AdminPanel = () => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState("");
  const [newCode, setNewCode] = useState(""); // New code for modifying coupon
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [couponToEdit, setCouponToEdit] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin-login"); // Redirect if not logged in
    } else {
      axios
        .get("https://coupon-distribution-020j.onrender.com/admin/coupons", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setCoupons(res.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setError("Failed to load coupons");
          navigate("/admin-login"); // Redirect on error
        });
    }
  }, [token, navigate]);

  const addCoupon = async () => {
    if (!code) {
      setError("Coupon code cannot be empty!");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        "https://coupon-distribution-020j.onrender.com/admin/add-coupon",
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Coupon added successfully!");
      setCode(""); // Clear input
      setError(null);
      setLoading(false);
      // Reload the coupons after adding
      const res = await axios.get("https://coupon-distribution-020j.onrender.com/admin/coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(res.data);
    } catch (err) {
      setError("Error adding coupon");
      setLoading(false);
    }
  };

  const toggleCouponAvailability = async (couponId) => {
    setLoading(true);
    try {
      await axios.put(
        `https://coupon-distribution-020j.onrender.com/admin/toggle-coupon/${couponId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Reload the coupons after toggling
      const res = await axios.get("https://coupon-distribution-020j.onrender.com/admin/coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(res.data);
      setLoading(false);
    } catch (err) {
      setError("Error toggling coupon availability");
      setLoading(false);
    }
  };

  const modifyCoupon = async (couponId) => {
    if (!newCode) {
      setError("New coupon code cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `https://coupon-distribution-020j.onrender.com/admin/modify-coupon/${couponId}`,
        { code: newCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Coupon modified successfully!");
      setCouponToEdit(null); // Close the modal
      setNewCode(""); // Clear input
      setError(null);
      setLoading(false);
      // Reload the coupons after modification
      const res = await axios.get("https://coupon-distribution-020j.onrender.com/admin/coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(res.data);
    } catch (err) {
      setError("Error modifying coupon");
      setLoading(false);
    }
  };


  return (
    <div className="admin-panel-container">
      <h1 className="admin-title">Admin Panel</h1>
      <p className="admin-description">Manage coupons and view claim history.</p>

      {/* Add Coupon Section */}
      <div className="coupon-management">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Coupon Code"
          className="coupon-input"
        />
        <button onClick={addCoupon} disabled={loading} className="action-button">
          {loading ? "Adding..." : "Add Coupon"}
        </button>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>

      {/* Coupon List */}
      <div className="coupon-list">
        <h2>Coupon List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="coupon-grid">
            {coupons.map((coupon) => (
              <div key={coupon._id} className="coupon-item">
                <span className="coupon-code">{coupon.code}</span>
                <span
                  className={`coupon-status ${
                    coupon.claimedBy ? "claimed" : "available"
                  }`}
                >
                  {coupon.claimedBy ? "Claimed" : "Available"}
                </span>
                {coupon.claimedBy &&
                
                <div><span className="coupon-claimedby">Claimed By:</span>{coupon.claimedBy}</div>
            }
                <button
                  onClick={() => toggleCouponAvailability(coupon._id)}
                  className="toggle-button"
                >
                  {coupon.available ? "Mark as Unavailable" : "Mark as Available"}
                </button>
                {coupon.claimedBy === null && (
                  <button
                    onClick={() => setCouponToEdit(coupon)}
                    className="edit-button"
                  >
                    Edit Coupon
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Edit Coupon Modal */}
      {couponToEdit && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Coupon Code</h3>
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="New Coupon Code"
            />
            {error && <p className="error-text">{error}</p>}
            {successMessage && <p className="success-text">{successMessage}</p>}
            <button onClick={modifyCoupon} className="modal-modify-button">
              {loading ? "Modifying..." : "Modify Coupon"}
            </button>
            <button className="modal-cancel-btn" onClick={() => setCouponToEdit(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
