import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("credentials", credentials);
    try {
      const res = await axios.post("https://coupon-distribution-020j.onrender.com/admin/login", credentials);
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin"); // Redirect after successful login
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="main-container">
    <div className="container">
      <div className="box">
        <h2>Admin Login</h2>
        <input 
          type="text" placeholder="Username" value={credentials.username} 
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          className="input-field"
        />
        <input 
          type="password" placeholder="Password" value={credentials.password} 
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          className="input-field"
        />
        {error && <p className="error-text">{error}</p>}
        <button onClick={handleLogin} className="login-button">Login</button>
      </div>
    </div>
    </div>
  );
};


export default AdminLogin;
