const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  id: String,
  roomNumber: { type: String, required: true },
  roomName: { type: String, required: true },
  seats: { type: Number },
  projector: { type: Boolean, default: false },
  whiteboard: { type: Boolean, default: false },
  speakerSystem: { type: Boolean, default: false },
  lastModified: Date,
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  priority: { type: Number, default: 0 },
});

module.exports = mongoose.model("Room", roomSchema);
