const mongoose = require("mongoose");

const floorSchema = new mongoose.Schema({
  id: String,
  floorNumber: {
     type: Number, 
     required: true 
    },
  rooms: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Room" ,
    booked: { type: Boolean, default: false },
}],
    lastModified: {
        type: Date,
        default: Date.now,
      },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: { type: Number, default: 0 },
});

module.exports = mongoose.model("Floor", floorSchema);
