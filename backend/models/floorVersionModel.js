const mongoose = require("mongoose");

const generateId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const commitSchema = new mongoose.Schema({
  id: {
    type: String,
    default: generateId,
    immutable: true,
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Floor", // Automatically generated ObjectId
  },
  modifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  timestamp: {
    type: Date,
    default: Date.now, // Auto-generated timestamp
  },
});

const flooVersionSchema = new mongoose.Schema({
  id: {
    type: String,
    default: generateId,
    immutable: true,
  },
  commits: [commitSchema],
  modifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }
});

module.exports = mongoose.model("FloorVersion", flooVersionSchema);