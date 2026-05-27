const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'default', unique: true },
    REACT: { type: [String], default: [] },
    JS: { type: [String], default: [] },
    CODING: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
