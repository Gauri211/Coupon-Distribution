const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  claimedBy: { type: String, default: null }, // Store IP or session ID
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Coupon', CouponSchema);
