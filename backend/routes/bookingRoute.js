const express = require("express");
const router = express.Router();

const { addFloor } = require("../controllers/floorController");
const userModel = require("../models/userModel");
const roomModel = require("../models/roomModel");
const floorModel = require("../models/floorModel");
const commitSchema = require("../models/commitSchema");
router.use(express.json());

router.patch('/floors/:floorId/rooms/:roomId/book', async (req, res) => {
    try {
      const { floorId, roomId } = req.params;
  
      // Find the latest floor by floorId
      const floor = await floorModel.findOne({ id: floorId })
        .sort({ lastModified: -1 }) // Sort by lastModified in descending order
        .populate('rooms');
  
      if (!floor) {
        return res.status(404).send('Floor not found');
      }
  
      // Find the room by roomId within the floor's rooms array
      const room = floor.rooms.find(room => room._id.toString() === roomId);
  
      if (!room) {
        return res.status(404).send('Room not found');
      }
  
      // Update isBooked field and increment priority
      room.isBooked = true;
      room.priority = room.priority + 1;
  
      // Save the updated floor document
      await room.save();
  
      res.status(200).json({ message: 'Room booked successfully', room });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  
module.exports = router;