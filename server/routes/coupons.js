const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");
const axios = require("axios");

const claimCooldown = {}; // Track IP cooldowns

router.post('/claim', async (req, res) => {
  const getIp = await axios.get("https://api.ipify.org/?format=json");
  const userIP = getIp.data.ip;
  const userSession = req.cookies.session_id || Math.random().toString(36).substring(7);

  if (claimCooldown[userIP] && Date.now() - claimCooldown[userIP] < 60000) {
    return res.status(429).json({ message: "Please wait before claiming another coupon." });
  }

  let coupon = await Coupon.findOne({ claimedBy: null });
  if (!coupon) return res.status(400).json({ message: "No coupons available." });

  coupon.claimedBy = userIP;
  coupon.available = false;
  await coupon.save();

  claimCooldown[userIP] = Date.now();
  res.cookie('session_id', userSession, { httpOnly: true });

  res.json({ message: "Coupon claimed successfully!", coupon: coupon.code });
});

module.exports = router;
