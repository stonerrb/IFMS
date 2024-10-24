const mongoose = require("mongoose");

const generateId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const commitSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  modifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

// const flooVersionSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: generateId,
//     immutable: true,
//   },
//   cnt: {
//     type: Number,
//     default: 0,
//   },
//   commits: [commitSchema],
//   modifiedBy: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User" 
//   }
// });

// flooVersionSchema.pre('save', function (next) {
//   this.cnt += 1;
//   next();
// });

module.exports = mongoose.model("FloorVersion", commitSchema);