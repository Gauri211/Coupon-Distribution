const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Coupon = require("../models/Coupon");

require("dotenv").config();

const router = express.Router();

// Admin Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // Static admin credentials
    if (username !== process.env.USERNAME || password !== process.env.PASSWORD) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  });

// View Coupons
router.get("/coupons", auth, async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

// Add Coupon
router.post("/add-coupon", auth, async (req, res) => {
  const { code } = req.body;
  const newCoupon = new Coupon({ code });
  await newCoupon.save();
  res.json({ message: "Coupon added successfully!" });
});

// Update Coupon
router.put("/modify-coupon/:id", auth, async (req, res) => {
    const { code } = req.body;
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    if (coupon.claimedBy) return res.status(400).json({ message: "Coupon already claimed, cannot be modified" });
  
    coupon.code = code || coupon.code; 
    await coupon.save();
    res.json({ message: "Coupon updated successfully!" });
  });

// Toggle Coupon Availability
router.put("/toggle-coupon/:id", auth, async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });

  coupon.available = !coupon.available;
  coupon.claimedBy = null; 
  await coupon.save();
  res.json({ message: "Coupon updated successfully!" });
});

// Get User Claim History
router.get("/history", auth, async (req, res) => {
  const claimedCoupons = await Coupon.find({ claimedBy: { $ne: null } });
  res.json(claimedCoupons);
});

module.exports = router;
